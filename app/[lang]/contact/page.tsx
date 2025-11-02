import { LocaleParams } from '@/types';
import { setRequestLocale } from 'next-intl/server';
import { ContactContent } from '@/components/portfolio/contact-content';

export default async function ContactPage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;
  setRequestLocale(lang);

  return <ContactContent lang={lang} />;
}
