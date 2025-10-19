'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface NavigationProps {
  lang: string;
}

export function Navigation({ lang }: NavigationProps) {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const isActive = (path: string) => {
    if (path === `/${lang}`) {
      return pathname === `/${lang}` || pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: `/${lang}`, label: t('home') },
    { href: `/${lang}/services`, label: t('services') },
    { href: `/${lang}/projects`, label: t('projects') },
    { href: `/${lang}/about`, label: t('about') },
    { href: `/${lang}/contact`, label: t('contact') },
  ];

  return (
    <div 
      className="hidden md:flex items-center rounded-full p-1 backdrop-blur-md shadow-lg" 
      style={{ 
        background: 'var(--color-surface)',
        border: '1px solid var(--color-primary)'
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'relative px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300',
            isActive(item.href)
              ? 'text-white shadow-lg'
              : 'nav-tab-hover hover:scale-105'
          )}
          style={
            isActive(item.href)
              ? { 
                  background: 'var(--gradient-primary)', 
                  color: 'white' 
                }
              : { 
                  color: 'var(--color-text)', 
                  backgroundColor: 'transparent' 
                }
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}