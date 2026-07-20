const matchLocaleCandidate = <TLocale extends string>(
  candidate: string,
  supportedLocales: readonly TLocale[],
  localToLanguage: (locale: TLocale) => string
): TLocale | undefined => {
  return supportedLocales.find(
    (supportedLocale) => (
      candidate === supportedLocale
      || candidate.split('-')[0] === localToLanguage(supportedLocale)
    )
  )
}

const matchBrowserLocales = <TLocale extends string>(
  browserLocales: readonly string[],
  supportedLocales: readonly TLocale[],
  localToLanguage: (locale: TLocale) => string
): TLocale | undefined => {
  return browserLocales
    .map((browserLocale) => matchLocaleCandidate(browserLocale, supportedLocales, localToLanguage))
    .find((entry): entry is TLocale => entry !== undefined)
}


const isoLocaleToLanguageShort = (locale: string) => locale.split('-')[0]

export const LocalizationUtils = {
  isoLocaleToLanguageShort,
  matchLocaleCandidate,
  matchBrowserLocales,
}
