import type { GeneratedTranslationEntries, SupportedLocale } from '@/src/i18n/translations'
import { generatedTranslations } from '@/src/i18n/translations'
import { useLocale } from '@/src/i18n/LocaleProvider'
import type { PartialTranslation, Translation, TranslationEntries } from '@helpwave/internationalization'
import { combineTranslation, ICUUtil } from '@helpwave/internationalization'
import { ArrayUtil } from '@/src/utils/array'
import type { SingleOrArray } from '@/src/utils/typing'

/**
 * Use for translations where you know that all values are ICU strings.
 *
 * This most likely is the case for Translations provided by a backend,
 * for more dynamic and typesafe translation use useTranslation instead
 */
export function useICUTranslation<L extends string, T extends Record<string, string>>(
  translations: Translation<L, T>[] | Translation<L, T>,
  locale: L
) {
  translations = Array.isArray(translations) ? translations : [translations]

  return function translate(
    key: string,
    values?: Record<string, object>
  ): string {
    try {
      for (let i = 0; i < translations.length; i++) {
        const localizedTranslation = translations[i][locale]
        if (!localizedTranslation) continue

        const msg = localizedTranslation[key]
        if (typeof msg === 'string') {
          return ICUUtil.interpret(msg, values)
        }
      }
      console.warn(`useTranslation: No translation for key "${key}" found.`)
    } catch (e) {
      console.error(`useTranslation: Error translating key "${String(key)}"`, e)
    }

    return `{{${String(locale)}:${String(key)}}}`
  }
}

// TODO allow translation overwrites
type UseTranslationOverwrites = {
  locale?: SupportedLocale,
}

type TranslationExtension<
  L1 extends string,
  L2 extends string,
  T1 extends TranslationEntries,
  T2 extends TranslationEntries
> = PartialTranslation<L1 | L2, T1 & T2>

type BaseTranslationExtension<L extends string, T extends TranslationEntries>
  = TranslationExtension<L, SupportedLocale, T, GeneratedTranslationEntries>
/**
 * A wrapper for the useTranslation to load and specify the translations for the library
 */
export function useTranslation<L extends string, T extends TranslationEntries>(
  extensions?: SingleOrArray<BaseTranslationExtension<L,T>>,
  overwrites?: UseTranslationOverwrites
) {
  const { locale: inferredLocale } = useLocale()
  const locale = overwrites?.locale ?? inferredLocale
  const translationExtensions = ArrayUtil.resolveSingleOrArray(extensions)

  return combineTranslation<L | SupportedLocale, T & GeneratedTranslationEntries>([
    ...translationExtensions,
    generatedTranslations as BaseTranslationExtension<L,T>
  ], locale)
}
