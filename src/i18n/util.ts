import type { HightideTranslationLocales } from '@/src/i18n/translations'
import { hightideTranslationLocales } from '@/src/i18n/translations'

/**
 * The supported locales' names in their respective language
 */
const localsNames: Record<HightideTranslationLocales, string> = {
  'en-US': 'English (US)',
  'de-DE': 'Deutsch',
}

function localeToLanguage(locale: HightideTranslationLocales) {
  return locale.split('-')[0]
}

/**
 * A constant definition for holding data regarding languages
 */
export const LocalizationUtil = {
  locals: hightideTranslationLocales,
  localToLanguage: localeToLanguage,
  languagesLocalNames: localsNames,
}
