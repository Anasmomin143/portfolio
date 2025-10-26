import { AuthSessionProvider } from '@/components/providers/session-provider';
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper';
import { ReduxProvider } from '@/lib/redux/provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { GlobalLoader } from '@/components/providers/global-loader';
import { auth } from '@/lib/auth/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <ReduxProvider>
      <AuthSessionProvider>
        <AdminLayoutWrapper session={session}>
          {children}
        </AdminLayoutWrapper>
        <ToastProvider />
        <GlobalLoader />
      </AuthSessionProvider>
    </ReduxProvider>
  );
}