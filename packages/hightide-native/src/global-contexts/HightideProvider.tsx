import { useMemo, type PropsWithChildren } from 'react'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'
import { useLocalization } from '@helpwave/hightide-utils/context/localization'
import { HightideContext } from './HightideContext'
import type { LocalizationProviderProps } from './localization'
import { LocalizationProvider } from './localization'
import type { ThemeProviderProps } from './theme'
import { ThemeProvider, useTheme } from './theme'
import type { TranslationProviderProps } from './translation'
import { TranslationProvider } from './translation'

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
