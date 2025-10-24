'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminSidebar } from './admin-sidebar';
import { ReactNode, useEffect } from 'react';

interface AdminLayoutWrapperProps {
  children: ReactNode;
  session: any;
}

export function AdminLayoutWrapper({ children, session: serverSession }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: clientSession, status } = useSession();
  const isLoginPage = pathname === '/admin/login';

  // Use client session status to determine authentication
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`/admin/login?callbackUrl=${callbackUrl}`);
    }
  }, [status, isLoginPage, pathname, router]);

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect happening - show nothing
  if (status === 'unauthenticated') {
    return null;
  }

  // Authenticated - show admin layout
  const session = clientSession || serverSession;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar user={{ email: session?.user?.email || '', name: session?.user?.name || 'Admin' }} />

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20 lg:pt-6 lg:ml-64 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
