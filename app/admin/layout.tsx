import { AuthSessionProvider } from '@/components/providers/session-provider';
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow access to login page without authentication
  // All other admin pages require authentication
  const isLoginPage = false; // Will be checked in client component

  return (
    <AuthSessionProvider>
      <AdminLayoutWrapper session={session}>{children}</AdminLayoutWrapper>
    </AuthSessionProvider>
  );
}