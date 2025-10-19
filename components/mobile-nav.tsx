'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { ThemeSelector } from '@/components/theme-selector';
import { GlassModeToggle } from '@/components/glass-mode-toggle';

interface MobileNavProps {
  lang: string;
}

export function MobileNav({ lang }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMenu}
        className="md:hidden p-2 transition-colors"
        style={{ color: 'var(--color-text)' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40">
          <div 
            className="px-6 py-4 space-y-3 backdrop-blur-md"
            style={{ 
              background: 'var(--color-surface)', 
              borderTop: '1px solid var(--color-primary)' 
            }}
          >
            <Link
              href={`/${lang}`}
              className="block px-4 py-2 font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-text)' }}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href={`/${lang}/services`}
              className="block px-4 py-2 font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href={`/${lang}/projects`}
              className="block px-4 py-2 font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setIsOpen(false)}
            >
              My Projects
            </Link>
            <Link
              href={`/${lang}/about`}
              className="block px-4 py-2 font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="block px-4 py-2 font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-primary)' }}>
              <div className="flex items-center space-x-3">
                {/* <GlassModeToggle /> */}
                <ThemeSelector />
              </div>
              <Link 
                href={lang === 'en' ? '/fr' : '/en'} 
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300"
                style={{ color: 'var(--color-text)' }}
                onClick={() => setIsOpen(false)}
              >
                <Globe className="w-3 h-3" />
                {lang === 'en' ? 'FR' : 'EN'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}