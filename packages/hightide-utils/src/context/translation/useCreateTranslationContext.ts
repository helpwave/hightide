import type { PartialTranslation, TranslationEntries } from '@helpwave/internationalization'
import { combineTranslation } from '@helpwave/internationalization'
import { useMemo } from 'react'
import { useLocalization } from '../localization/useLocalization'
import { ArrayUtil, type SingleOrArray } from '@/src/utils'

export type UseCreateTranslationContextProps = {
  translation: SingleOrArray<PartialTranslation<string, TranslationEntries>>,
  locale?: string,
}

export const useCreateTranslationContext = ({
  translation,
  locale: localeOverride,
}: UseCreateTranslationContextProps): ReturnType<
  typeof combineTranslation<string, TranslationEntries>
> => {
  const { locale: inferredLocale } = useLocalization()
  const locale = useMemo(() => localeOverride ?? inferredLocale, [inferredLocale, localeOverride])

  return useMemo(
    () => combineTranslation<string, TranslationEntries>(ArrayUtil.resolveSingleOrArray(translation), locale),
    [locale, translation]
  )
}
