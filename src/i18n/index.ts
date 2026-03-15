/**
 * Internationalization support for Alexi
 * Currently supports English only, with infrastructure for future expansion
 */

import { en, type Translations } from './en.js';

type Locale = 'en';

const translations: Record<Locale, Translations> = {
  en,
};

let currentLocale: Locale = 'en';

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  if (locale in translations) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' not supported, falling back to 'en'`);
    currentLocale = 'en';
  }
}

/**
 * Get translations for the current locale
 */
export function getTranslations(): Translations {
  return translations[currentLocale];
}

/**
 * Get a translation string by key path
 */
export function t(keyPath: string): string {
  const keys = keyPath.split('.');
  let value: any = translations[currentLocale];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
  }

  return typeof value === 'string' ? value : keyPath;
}

// Export translation object for direct access
export { en };
export type { Translations };
