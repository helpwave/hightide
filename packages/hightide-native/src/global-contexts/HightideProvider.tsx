import {
  useMemo,
  type PropsWithChildren
} from 'react'
import type { TextStyle } from 'react-native'

import { useLocalization } from '@helpwave/hightide-utils/context/localization'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'

import { HightideContext } from './HightideContext'
import {
  ContentThemeProvider
} from './content-theme/ContentThemeProvider'
import {
  LocalizationProvider,
  type LocalizationProviderProps
} from './localization/LocalizationProvider'
import { useTheme } from './theme/ThemeContext'
import {
  ThemeProvider,
  type ThemeProviderProps
} from './theme/ThemeProvider'
import {
  TranslationProvider,
  type TranslationProviderProps
} from './translation/forward-exports'
import type { HightideTheme } from '../theme'

export type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps<HightideTheme>, 'children'>,
  locale?: Omit<LocalizationProviderProps, 'children'>,
  translation?: Omit<TranslationProviderProps, 'children' | 'locale'>,
}

const toNativeTextStyle = (style: {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily?: string,
}): TextStyle => ({
  fontSize: Number(style.fontSize),
  lineHeight: typeof style.lineHeight === 'number'
    ? style.lineHeight
    : Number(style.lineHeight),
  fontWeight: style.fontWeight as TextStyle['fontWeight'],
  fontFamily: style.fontFamily,
})

const ContentThemeFromTheme = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()
  const textStyle = useMemo(
    () => toNativeTextStyle(theme.typography.scales.body.medium),
    [theme.typography.scales.body.medium]
  )

  return (
    <ContentThemeProvider
      foregroundColor={theme.colors.onSurface}
      textStyle={textStyle}
    >
      {children}
    </ContentThemeProvider>
  )
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
          <ContentThemeFromTheme>
            <HightideContextBridge>
              {children}
            </HightideContextBridge>
          </ContentThemeFromTheme>
        </ThemeProvider>
      </TranslationProvider>
    </LocalizationProvider>
  )
}
