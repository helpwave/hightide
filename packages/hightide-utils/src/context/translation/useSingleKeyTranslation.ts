import { useMemo } from 'react'
import { ArrayUtil } from '../../utils'
import type { SingleOrArray } from '../../utils'
import { useLocalization } from '../localization'

export function useSingleKeyTranslation(
  translations: SingleOrArray<Record<string, string>>
) : string {
  const { locale } = useLocalization()
  const translationList = ArrayUtil.resolveSingleOrArray(translations)

  const translation = useMemo((): string => {
    try {
      for (let i = 0; i < translationList.length; i++) {
        const localizedTranslation = translationList[i][locale]

        if (!localizedTranslation) continue

        return localizedTranslation
      }
      console.warn(`useTranslation: No translation for locale "${locale}" found.`)
    } catch (e) {
      console.error(`useTranslation: Error translating locale "${String(locale)}"`, e)
    }

    return `{{${String(locale)}}}`
  }, [locale, translationList])
  return translation
}
