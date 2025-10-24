
import { AdminSidebar } from '@/components/admin';
import { COMMON_INLINE_STYLES } from '@/lib/constants/styles';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar user={{ email: '', name: 'Admin' }} />

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20 lg:pt-6 lg:ml-64 bg-gray-50">
        {children}
      </main>
    </div>
  );
}