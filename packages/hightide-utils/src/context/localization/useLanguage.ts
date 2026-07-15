import { useLocalization } from './useLocalization'

export const useLanguage = <TLocale extends string = string>(
  localToLanguage: (locale: TLocale) => string = (locale) => locale.split('-')[0],
) => {
  const { locale } = useLocalization<TLocale>()
  return { language: localToLanguage(locale) }
}
