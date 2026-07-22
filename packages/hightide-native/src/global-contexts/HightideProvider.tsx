import {
  useMemo,
  type PropsWithChildren
} from 'react'

import { useLocalization } from '@helpwave/hightide-utils/context/localization'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'

import { HightideContext } from '@/src/global-contexts/HightideContext'
import {
  LocalizationProvider,
  type LocalizationProviderProps
} from '@/src/global-contexts/localization/LocalizationProvider'
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import {
  ThemeProvider,
  type ThemeProviderProps
} from '@/src/global-contexts/theme/ThemeProvider'
import {
  TranslationProvider,
  type TranslationProviderProps
} from '@/src/global-contexts/translation/forward-exports'

export type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children'>,
  locale?: Omit<LocalizationProviderProps, 'children'>,
  translation?: Omit<TranslationProviderProps, 'children' | 'locale'>,
}

const HightideContextBridge = ({ children }: PropsWithChildren) => {
  const { isInitialized: isLocalizationInitialized } = useLocalization()
  const { isInitialized: isThemeInitialized } = useTheme()

  const value = useMemo(() => ({
    isLocalizationInitialized,
    isThemeInitialized,
  }), [isLocalizationInitialized, isThemeInitialized])

  return (
    <HightideContext.Provider value={value}>
      {children}
    </HightideContext.Provider>
  )
}

export const HightideProvider = ({
  children,
  theme,
  locale,
  translation,
}: HightideProviderProps) => {
  const resolvedTranslations = useMemo(() => [
    ...ArrayUtil.resolveSingleOrArray(translation?.translation ?? []),
    hightideTranslation,
  ], [translation?.translation])

  return (
    <LocalizationProvider {...locale}>
      <TranslationProvider {...translation} translation={resolvedTranslations}>
        <ThemeProvider {...theme}>
          <HightideContextBridge>
            {children}
          </HightideContextBridge>
        </ThemeProvider>
      </TranslationProvider>
    </LocalizationProvider>
  )
}
