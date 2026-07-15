import { hightideTranslationLocales } from './translations'

const isoLocaleToLanguage = (locale: string) => locale.split('-')[0]

export const LocalizationUtil = {
  locales: hightideTranslationLocales,
  isoLocaleToLanguage,
}
