import { interpretICU } from '@/src/i18n/interpretICU'
import { ArrayUtil } from '@/src/utils/array'
import type { Exact, SingleOrArray } from '@/src/utils/typing'
import type { SupportedLocale } from '@/src/i18n/translations'
import { generatedTranslations } from '@/src/i18n/translations'
import { useLocale } from '@/src/i18n/LocaleProvider'

export type TranslationEntry = string | ((values: object) => string)

export type TranslationEntries = Record<string, TranslationEntry>

export type Translation<L extends string, T extends TranslationEntries = TranslationEntries> = Record<L, T>

export type PartialTranslation<L extends string, T extends TranslationEntries = TranslationEntries> = Partial<Record<L, Partial<T>>>

/**
 * Use for translations where you know that all values are ICU strings.
 *
 * This most likely is the case for Translations provided by a backend,
 * for more dynamic and typesafe translation use useTranslation instead
 */
export function useICUTranslation<L extends string, T extends TranslationEntries>(
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
          return interpretICU(msg, values)
        }
      }
      console.warn(`useTranslation: No translation for key "${key}" found.`)
    } catch (e) {
      console.error(`useTranslation: Error translating key "${String(key)}"`, e)
    }

    return `{{${String(locale)}:${String(key)}}}`
  }
}

/**
 * A hook for merging many translations and outputting the result of the first
 * matching translation
 */
export function useTranslation<L extends string, T extends TranslationEntries>(
  translations: SingleOrArray<PartialTranslation<L, T>>,
  locale: L
) {
  function translation<K extends keyof T>(
    key: K,
    values?: T[K] extends (...args: infer P) => unknown ? Exact<P[0], P[0]> : never
  ): string {
    for (const translation of ArrayUtil.resolveSingleOrArray(translations)) {
      const localizedTranslation = translation[locale]
      if (!localizedTranslation) continue

      const msg = localizedTranslation[key]
      if (!msg) continue

      if (typeof msg === 'string') {
        return msg
      } else if (typeof msg === 'function') {
        return msg(values as never)
      }
    }
    console.warn(`Missing key or locale for locale "${locale}" and key "${String(key)}" in all translations`)
    return `{{${locale}:${String(key)}}}`
  }

  return translation
}

// TODO allow translation overwrites
type UseStandardTranslationProps = {
  locale?: SupportedLocale,
}

/**
 * A wrapper for the useTranslation to load and specify the translations for the library
 */
export function useStandardTranslation(options?: UseStandardTranslationProps) {
  const { locale: inferredLocale } = useLocale()
  const locale = options?.locale ?? inferredLocale

  return useTranslation(generatedTranslations, locale)
}



