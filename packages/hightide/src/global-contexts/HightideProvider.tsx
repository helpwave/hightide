import { useMemo, type PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from '@/src/global-contexts/HightideConfigContext'
import { HightideConfigProvider } from '@/src/global-contexts/HightideConfigContext'
import type { LocalizationProviderProps } from '@/src/global-contexts/LocalizationProvider'
import { LocalizationProvider } from '@/src/global-contexts/LocalizationProvider'
import type { ThemeProviderProps } from '@/src/global-contexts/ThemeProvider'
import { ThemeProvider } from '@/src/global-contexts/ThemeProvider'
import type { TranslationProviderProps } from '@helpwave/hightide-utils'
import { ArrayUtil, hightideTranslation, TranslationProvider } from '@helpwave/hightide-utils'

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
