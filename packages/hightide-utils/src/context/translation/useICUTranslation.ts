import type { Translation } from '@helpwave/internationalization'
import { ICUUtil } from '@helpwave/internationalization'
import { useCallback } from 'react'
import { ArrayUtil } from '../../utils/array'
import type { SingleOrArray } from '../../utils/typing'

export function useICUTranslation<L extends string, T extends Record<string, string>>(
  translations: SingleOrArray<Translation<L, T>>,
  locale: L
) {
  const translationList = ArrayUtil.resolveSingleOrArray(translations)

  const translate = useCallback((
    key: string,
    values?: Record<string, object>
  ): string => {
    try {
      for (let i = 0; i < translationList.length; i++) {
        const localizedTranslation = translationList[i][locale]
        if (!localizedTranslation) continue

        const msg = localizedTranslation[key]
        if (typeof msg === 'string') {
          return ICUUtil.interpret(msg, values ?? {})
        }
      }
      console.warn(`useTranslation: No translation for key "${key}" found.`)
    } catch (e) {
      console.error(`useTranslation: Error translating key "${String(key)}"`, e)
    }

    return `{{${String(locale)}:${String(key)}}}`
  }, [locale, translationList])
  return translate
}
