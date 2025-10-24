'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { ReactNode } from 'react';

export function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

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
