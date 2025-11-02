import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    tenantId?: string;
    tenantSubdomain?: string;
    tenantName?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      tenantId: string;
      tenantSubdomain: string;
      tenantName: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    tenantId?: string;
    tenantSubdomain?: string;
    tenantName?: string;
    role?: string;
  }
}
