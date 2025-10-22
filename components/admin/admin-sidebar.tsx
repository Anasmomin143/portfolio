'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import {
  LayoutDashboard,
  Briefcase,
  FolderGit2,
  Award,
  Layers,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    email?: string | null;
    name?: string | null;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Layers },
  { name: 'Certifications', href: '/admin/certifications', icon: Award },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 p-4" style={{ background: THEME_GRADIENTS.card }}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
          style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)' }}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" style={COMMON_INLINE_STYLES.text} />
          ) : (
            <Menu className="w-6 h-6" style={COMMON_INLINE_STYLES.text} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:transform-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: THEME_GRADIENTS.card, borderRight: '1px solid var(--card-border)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <h2 className="text-xl font-bold" style={COMMON_INLINE_STYLES.text}>
              Admin Panel
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: isActive ? THEME_GRADIENTS.primary : 'transparent',
                        color: isActive ? 'white' : 'var(--color-text)',
                        boxShadow: isActive ? '0 4px 12px rgba(168, 85, 247, 0.3)' : 'none',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ background: 'var(--color-background)' }}>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ background: THEME_GRADIENTS.secondary }}
              >
                <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={COMMON_INLINE_STYLES.text}>
                  {user.name || 'Admin'}
                </p>
                <p className="text-xs truncate" style={COMMON_INLINE_STYLES.textMuted}>
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
