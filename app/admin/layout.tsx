import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { COMMON_INLINE_STYLES } from '@/lib/constants/styles';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page and auth pages render without sidebar
  return <>{children}</>;
}
