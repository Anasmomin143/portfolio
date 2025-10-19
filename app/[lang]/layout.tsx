import { Inter } from 'next/font/google';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LocaleParams } from '@/types';
import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import '@/app/globals.css';

// Dynamic imports for client components
const ThemeSelector = dynamic(() => import('@/components/theme-selector').then(mod => ({ default: mod.ThemeSelector })));
const MobileNav = dynamic(() => import('@/components/mobile-nav').then(mod => ({ default: mod.MobileNav })));
const Navigation = dynamic(() => import('@/components/navigation').then(mod => ({ default: mod.Navigation })));
const SmoothHeader = dynamic(() => import('@/components/smooth-header').then(mod => ({ default: mod.SmoothHeader })));

// Dynamic imports for icons (used in server component)
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })));
const Heart = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Heart })));

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations();
  const messages = await getMessages();

  return (
    <html lang={lang} className={inter.className}>
      <body className="min-h-screen antialiased" style={{ background: 'var(--color-background)' }}>
        <NextIntlClientProvider messages={messages}>
          <SmoothHeader>
            <nav className="relative mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                </div>

                {/* Unified Tab Group Navigation */}
                <Navigation lang={lang} />

                {/* Right side - Contact Button with controls */}
                <div className="flex items-center space-x-3">
                  {/* Hidden controls on smaller screens, shown in mobile menu */}
                  <div className="hidden lg:flex items-center space-x-2">
                    {/* <GlassModeToggle /> */}
                    <ThemeSelector />
                    <Link href={lang === 'en' ? '/fr' : '/en'} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-all duration-300" style={{ color: 'var(--color-text)' }}>
                      <Globe className="w-3 h-3" />
                      {lang === 'en' ? 'FR' : 'EN'}
                    </Link>
                  </div>
                  
                  {/* Contact Button */}
                  <Link
                    href={`/${lang}/contact`}
                    className="px-6 py-2 text-white font-medium rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {t('navigation.contact')}
                  </Link>

                  <MobileNav lang={lang} />
                </div>
              </div>
            </nav>
          </SmoothHeader>
          <main className="flex-1">{children}</main>
          <footer className="border-t mt-auto" style={{ background: 'var(--gradient-secondary)', borderColor: 'var(--color-primary)' }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <p className="text-center text-sm font-medium flex items-center justify-center gap-2" style={{ color: 'var(--color-muted)' }}>
                {t('footer.copyright')} <Heart className="w-4 h-4 text-red-500" /> {t('footer.tagline')}
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}