import { useLocale } from '@/src/contexts/LocaleContext'
import type {
  PartialTranslationExtension,
  Translation,
  TranslationEntries
} from '@helpwave/internationalization'
import { combineTranslation, ICUUtil } from '@helpwave/internationalization'
import { ArrayUtil } from '@/src/utils/array'
import type { SingleOrArray } from '@/src/utils/typing'
import type { HightideTranslationEntries, HightideTranslationLocales } from '@/src/i18n/translations'
import { hightideTranslation } from '@/src/i18n/translations'
import { useMemo } from 'react'

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

type UseHidetideTranslationOverwrites = {
  locale?: HightideTranslationLocales,
}

type HidetideTranslationExtension<L extends string, T extends TranslationEntries>
  = PartialTranslationExtension<L, HightideTranslationLocales, T, HightideTranslationEntries>
/**
 * A wrapper for the useHightideTranslation to load and specify the translations for the library
 */
export function useHightideTranslation<L extends string, T extends TranslationEntries>(
  extensions?: SingleOrArray<HidetideTranslationExtension<L,T>>,
  overwrites?: UseHidetideTranslationOverwrites
) {
  const { locale: inferredLocale } = useLocale()
  const locale = overwrites?.locale ?? inferredLocale

  return useMemo(() => combineTranslation<L | HightideTranslationLocales, T & HightideTranslationEntries>([
    ... ArrayUtil.resolveSingleOrArray(extensions),
    hightideTranslation as HidetideTranslationExtension<L,T>
  ], locale),
  [locale, extensions])
}
