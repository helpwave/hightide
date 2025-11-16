import type { SupportedLocale } from '@/src/i18n/translations'
import { supportedLocales } from '@/src/i18n/translations'

/**
 * The supported locales' names in their respective language
 */
const localsNames: Record<SupportedLocale, string> = {
  'en-US': 'English (US)',
  'de-DE': 'Deutsch',
}

/**
 * The default locale
 */
const DEFAULT_LOCALE: SupportedLocale = 'en-US'

function localeToLanguage(locale: SupportedLocale) {
  return locale.split('-')[0]
}

/**
 * A constant definition for holding data regarding languages
 */
export const LocalizationUtil = {
  locals: supportedLocales,
  localToLanguage: localeToLanguage,
  DEFAULT_LOCALE,
  languagesLocalNames: localsNames,
}
