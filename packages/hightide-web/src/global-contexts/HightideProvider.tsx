import { useMemo, type PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from './hightide-config/HightideConfigContext'
import { HightideConfigProvider } from './hightide-config/HightideConfigContext'
import type { LocalizationProviderProps } from './localization/LocalizationProvider'
import { LocalizationProvider } from './localization/LocalizationProvider'
import type { ThemeProviderProps } from './theme/ThemeProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import type { TranslationProviderProps } from '@helpwave/hightide-utils/context/translation'
import { TranslationProvider } from '@helpwave/hightide-utils/context/translation'
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
