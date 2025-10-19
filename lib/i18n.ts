import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as typeof locales[number])) notFound();

  return {
    messages: (await import(`../i18n/${locale}.json`)).default
  };
});