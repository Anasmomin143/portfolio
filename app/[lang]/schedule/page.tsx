'use client';

import { use } from 'react';
import { LocaleParams } from '@/types';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import resumeData from '@/data/resume.json';

const FadeIn = dynamic(() => import('@/components/animations/fade-in').then(mod => ({ default: mod.FadeIn })));
const ScaleIn = dynamic(() => import('@/components/animations/scale-in').then(mod => ({ default: mod.ScaleIn })));
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
const MeetingScheduler = dynamic(() => import('@/components/scheduler/meeting-scheduler').then(mod => ({ default: mod.MeetingScheduler })), { ssr: false });

export default function SchedulePage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = use(params);
  const t = useTranslations('schedule');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <FadeIn delay={0.2}>
          <div className="mb-8">
            <ScaleIn delay={0.4}>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-soft" style={{ background: 'var(--gradient-secondary)', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                <Calendar className="w-4 h-4" />
                {t('badge')}
              </span>
            </ScaleIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} direction="up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-text)' }}>
            {t('title')}{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              {t('titleHighlight')}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.8} direction="up">
          <p className="mt-6 text-lg leading-8 max-w-3xl mx-auto font-medium" style={{ color: 'var(--color-muted)' }}>
            {t('description')}
          </p>
        </FadeIn>
      </div>

      <div className="max-w-6xl mx-auto">
        <FadeIn delay={1.0}>
          <div
            className="rounded-2xl shadow-strong overflow-hidden backdrop-blur-sm p-8"
            style={{ background: 'var(--gradient-card)', borderColor: 'var(--color-primary)' }}
          >
            <MeetingScheduler />

            {/* Alternative Contact Section */}
            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {t('contact.title')}
              </h3>
              <div className="space-y-3">
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  <strong style={{ color: 'var(--color-text)' }}>{t('contact.email')}</strong>{' '}
                  <a href={`mailto:${resumeData.personal.email}`} className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                    {resumeData.personal.email}
                  </a>
                </p>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  <strong style={{ color: 'var(--color-text)' }}>{t('contact.linkedin')}</strong>{' '}
                  <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                    {t('contact.linkedinText')}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Instructions */}
      <FadeIn delay={1.2}>
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-xl p-6" style={{ background: 'var(--gradient-secondary)', borderColor: 'var(--color-primary)' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              {t('instructions.title')}
            </h3>
            <ol className="space-y-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              <li>{t('instructions.step1')}</li>
              <li>{t('instructions.step2')}</li>
              <li>{t('instructions.step3')}</li>
              <li>{t('instructions.step4')}</li>
            </ol>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
