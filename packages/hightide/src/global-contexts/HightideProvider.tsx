import { useMemo, type PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from './hightide-config'
import { HightideConfigProvider } from './hightide-config'
import type { LocalizationProviderProps } from './localization'
import { LocalizationProvider } from './localization'
import type { ThemeProviderProps } from './theme'
import { ThemeProvider } from './theme'
import type { TranslationProviderProps } from './translation'
import { TranslationProvider } from './translation'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'

type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children'>,
  locale?: Omit<LocalizationProviderProps, 'children'>,
  translation?: Omit<TranslationProviderProps, 'children' | 'locale'>,
  config?: Omit<HightideConfigProviderProps, 'children'>,
}

export const HightideProvider = ({
  children,
  theme,
  locale,
  translation,
  config,
}: HightideProviderProps) => {
  const resolvedTranslations = useMemo(() => [
    ...ArrayUtil.resolveSingleOrArray(translation?.translation ?? []),
    hightideTranslation
  ], [translation?.translation])

  return (
    <HightideConfigProvider {...config}>
      <LocalizationProvider {...locale}>
        <TranslationProvider {...translation} translation={resolvedTranslations}>
          <ThemeProvider {...theme}>
            {children}
          </ThemeProvider>
        </TranslationProvider>
      </LocalizationProvider>
    </HightideConfigProvider>
  )
}
