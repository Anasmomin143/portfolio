import dynamic from 'next/dynamic';
import { LocaleParams } from '@/types';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomeHero } from '@/components/portfolio/home-hero';

// Dynamic imports for animation components
const ScaleIn = dynamic(() => import('@/components/animations/scale-in').then(mod => ({ default: mod.ScaleIn })));
const StaggerContainer = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerContainer })));
const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));

// Dynamic imports for icons
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })));
const Smartphone = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Smartphone })));
const Sparkles = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })));

export default async function HomePage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations('home');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <HomeHero
        lang={lang}
        translations={{
          languageLabel: t('languageLabel'),
          'cta.learnMore': t('cta.learnMore'),
          'cta.viewProjects': t('cta.viewProjects'),
          'cta.downloadResume': t('cta.downloadResume'),
        }}
      />
      
      {/* Feature highlights */}
      <StaggerContainer className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.15}>
        <StaggerItem>
          <HoverCard scaleOnHover={1.08} rotateOnHover={2}>
            <div className="group text-center p-6 rounded-2xl hover:shadow-medium transition-all duration-300" style={{ background: 'var(--gradient-card)', borderColor: 'var(--color-primary)' }}>
              <ScaleIn delay={1.4}>
                <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:rotate-3" style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </ScaleIn>
              <h3 className="mt-6 text-xl font-bold flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Zap className="w-5 h-5" />
                {t('features.performance.title')}
              </h3>
              <p className="mt-3 font-medium" style={{ color: 'var(--color-muted)' }}>{t('features.performance.description')}</p>
            </div>
          </HoverCard>
        </StaggerItem>
        
        <StaggerItem>
          <HoverCard scaleOnHover={1.08} rotateOnHover={-2}>
            <div className="group text-center p-6 rounded-2xl hover:shadow-medium transition-all duration-300" style={{ background: 'var(--gradient-card)', borderColor: 'var(--color-accent)' }}>
              <ScaleIn delay={1.6}>
                <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:rotate-3" style={{ backgroundColor: 'var(--color-accent)' }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </ScaleIn>
              <h3 className="mt-6 text-xl font-bold flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Smartphone className="w-5 h-5" />
                {t('features.responsive.title')}
              </h3>
              <p className="mt-3 font-medium" style={{ color: 'var(--color-muted)' }}>{t('features.responsive.description')}</p>
            </div>
          </HoverCard>
        </StaggerItem>
        
        <StaggerItem>
          <HoverCard scaleOnHover={1.08} rotateOnHover={2}>
            <div className="group text-center p-6 rounded-2xl hover:shadow-medium transition-all duration-300" style={{ background: 'var(--gradient-card)', borderColor: 'var(--color-secondary)' }}>
              <ScaleIn delay={1.8}>
                <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:rotate-3" style={{ backgroundColor: 'var(--color-secondary)' }}>
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </ScaleIn>
              <h3 className="mt-6 text-xl font-bold flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Sparkles className="w-5 h-5" />
                {t('features.quality.title')}
              </h3>
              <p className="mt-3 font-medium" style={{ color: 'var(--color-muted)' }}>{t('features.quality.description')}</p>
            </div>
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}