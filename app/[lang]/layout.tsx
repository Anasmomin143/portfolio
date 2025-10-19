import { Inter } from 'next/font/google';
import Link from 'next/link';
import { LocaleParams } from '@/types';
import { ThemeSelector } from '@/components/theme-selector';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className}>
      <body className="min-h-screen antialiased" style={{ background: 'var(--color-background)' }}>
          <header className="backdrop-blur-md border-b shadow-lg" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}>
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <h1 className="text-xl font-bold" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                      ✨ Portfolio
                    </h1>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link href={`/${lang}`} className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 rounded-t-lg hover:border-primary-400" style={{ color: 'var(--color-text)' }}>
                      Home
                    </Link>
                    <Link href={`/${lang}/about`} className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 rounded-t-lg hover:border-primary-400" style={{ color: 'var(--color-text)' }}>
                      About
                    </Link>
                    <Link href={`/${lang}/projects`} className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 rounded-t-lg hover:border-primary-400" style={{ color: 'var(--color-text)' }}>
                      Projects
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeSelector />
                  <Link href={lang === 'en' ? '/fr' : '/en'} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105" style={{ color: 'var(--color-primary)', background: 'var(--gradient-secondary)', borderColor: 'var(--color-primary)' }}>
                    🌐 {lang === 'en' ? 'FR' : 'EN'}
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t mt-auto" style={{ background: 'var(--gradient-secondary)', borderColor: 'var(--color-primary)' }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <p className="text-center text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                © 2024 Portfolio. Made with 💜 and cutting-edge tech.
              </p>
            </div>
          </footer>
      </body>
    </html>
  );
}