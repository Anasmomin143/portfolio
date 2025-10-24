import { AuthSessionProvider } from '@/components/providers/session-provider';
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AuthSessionProvider>
  );
}