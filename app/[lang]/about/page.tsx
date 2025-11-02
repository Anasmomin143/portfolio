import { LocaleParams } from '@/types';
import { setRequestLocale } from 'next-intl/server';
import { AboutContent } from '@/components/portfolio/about-content';

export default async function AboutPage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  return <AboutContent />;
}
