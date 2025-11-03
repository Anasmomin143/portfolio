import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { getServiceSupabase } from '@/lib/supabase/client';
import { getSubdomainInfo } from '@/lib/utils/subdomain';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        subdomain: { label: 'Subdomain', type: 'hidden' }, // Added for tenant context
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const supabase = getServiceSupabase();

          // Get subdomain from request if available
          let requestSubdomain: string | null = null;
          if (request?.headers) {
            const hostname = request.headers.get('host') || '';
            const subdomainInfo = getSubdomainInfo(hostname);
            requestSubdomain = subdomainInfo.subdomain;
          }

          // Find admin user by email with tenant information
          const { data: user, error } = await supabase
            .from('admin_users')
            .select(`
              *,
              tenant:tenants!admin_users_tenant_id_fkey (
                id,
                subdomain,
                name,
                status
              )
            `)
            .eq('email', email)
            .single();

          if (error || !user || !user.tenant) {
            throw new Error('Invalid credentials');
          }

          // Verify tenant is active
          if (user.tenant.status !== 'active') {
            throw new Error('Account is suspended');
          }

          // Multi-tenant validation: user must belong to the subdomain they're logging into
          if (requestSubdomain && user.tenant.subdomain !== requestSubdomain) {
            throw new Error('Invalid credentials for this domain');
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password_hash);

          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          // Return user object with tenant information
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            tenantId: user.tenant.id,
            tenantSubdomain: user.tenant.subdomain,
            tenantName: user.tenant.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add tenant info to JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.tenantId = (user as any).tenantId;
        token.tenantSubdomain = (user as any).tenantSubdomain;
        token.tenantName = (user as any).tenantName;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add tenant info to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).tenantId = token.tenantId as string;
        (session.user as any).tenantSubdomain = token.tenantSubdomain as string;
        (session.user as any).tenantName = token.tenantName as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnLoginPage = nextUrl.pathname === '/admin/login';

      // Admin panel requires authentication
      if (isOnAdminPanel && !isOnLoginPage) {
        if (!isLoggedIn) return false;

        // Validate user's tenant matches current subdomain
        // This prevents cross-tenant access via session manipulation
        const hostname = nextUrl.hostname;
        const subdomainInfo = getSubdomainInfo(hostname);

        // If accessing from a subdomain, verify user belongs to that tenant
        if (subdomainInfo.subdomain && auth.user) {
          const userTenantSubdomain = (auth.user as any).tenantSubdomain;

          // User must belong to the subdomain they're accessing
          if (userTenantSubdomain !== subdomainInfo.subdomain) {
            console.warn(
              `Cross-tenant access attempt blocked: User from ${userTenantSubdomain} trying to access ${subdomainInfo.subdomain}`
            );
            return false; // This will redirect to login
          }
        }

        return true;
      }

      // Redirect logged-in users away from login page
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL('/admin', nextUrl));
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
