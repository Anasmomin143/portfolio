import Link from 'next/link';
import { LocaleParams } from '@/types';
import { FadeIn } from '@/components/animations/fade-in';
import { ScaleIn } from '@/components/animations/scale-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';
import { FloatingElement } from '@/components/animations/floating-element';
import { HoverCard } from '@/components/animations/hover-card';
import { Rocket, Globe, Briefcase, Zap, Smartphone, Sparkles, Download } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations('home');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center relative">
        {/* Floating decorative elements */}
        <FloatingElement 
          className="absolute -top-4 left-1/4 w-16 h-16 rounded-full opacity-20" 
          intensity="gentle" 
          delay={0}
        >
          <div style={{ background: 'var(--gradient-primary)' }} className="w-full h-full rounded-full"></div>
        </FloatingElement>
        <FloatingElement 
          className="absolute top-8 right-1/4 w-12 h-12 rounded-full opacity-30" 
          intensity="medium" 
          delay={1}
        >
          <div style={{ background: 'var(--gradient-primary)' }} className="w-full h-full rounded-full"></div>
        </FloatingElement>
        
        <FadeIn delay={0.2}>
          <div className="mb-8">
            <ScaleIn delay={0.4}>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-soft" style={{ background: 'var(--gradient-secondary)', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                <Rocket className="w-4 h-4" />
                {t('badge')}
              </span>
            </ScaleIn>
          </div>
        </FadeIn>
        <FadeIn delay={0.6} direction="up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl relative" style={{ color: 'var(--color-text)' }}>
            {t('title')}{' '}
            <span className="animate-pulse" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              {t('titleHighlight')}
            </span>
            <div className="absolute -inset-1 rounded-lg blur-xl -z-10" style={{ background: 'var(--gradient-primary)', opacity: 0.3 }}></div>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.8} direction="up">
          <p className="mt-6 text-lg leading-8 max-w-3xl mx-auto font-medium" style={{ color: 'var(--color-muted)' }}>
            {t('subtitle')}
          </p>
        </FadeIn>

        <ScaleIn delay={1.0}>
          <p className="mt-4 text-sm font-semibold px-3 py-1 rounded-full inline-flex items-center gap-2" style={{ color: 'var(--color-primary)', background: 'var(--gradient-secondary)', borderColor: 'var(--color-primary)' }}>
            <Globe className="w-4 h-4" />
            {t('languageLabel')} {lang.toUpperCase()}
          </p>
        </ScaleIn>
        <StaggerContainer className="mt-12 flex items-center justify-center gap-x-6">
          <StaggerItem>
            <HoverCard scaleOnHover={1.08} rotateOnHover={-1}>
              <Link 
                href={`/${lang}/about`}
                className="group inline-flex items-center rounded-xl px-8 py-4 text-base font-semibold text-white shadow-medium hover:shadow-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300"
                style={{ background: 'var(--gradient-primary)', outlineColor: 'var(--color-primary)' }}
              >
                {t('cta.learnMore')}
                <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </HoverCard>
          </StaggerItem>
          <StaggerItem>
            <HoverCard scaleOnHover={1.08} rotateOnHover={1}>
              <Link 
                href={`/${lang}/projects`}
                className="group inline-flex items-center rounded-xl px-8 py-4 text-base font-semibold shadow-soft hover:shadow-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300"
                style={{ borderColor: 'var(--color-primary)', background: 'var(--gradient-secondary)', color: 'var(--color-primary)', outlineColor: 'var(--color-primary)' }}
              >
                {t('cta.viewProjects')}
                <Briefcase className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </HoverCard>
          </StaggerItem>
          <StaggerItem>
            <HoverCard scaleOnHover={1.08} rotateOnHover={-1}>
              <a
                href="/resume.pdf"
                download="Resume.pdf"
                className="group inline-flex items-center rounded-xl px-8 py-4 text-base font-semibold text-white shadow-medium hover:shadow-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300"
                style={{ background: 'var(--gradient-primary)', outlineColor: 'var(--color-primary)' }}
              >
                {t('cta.downloadResume')}
                <Download className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              </a>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>
      </div>
      
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