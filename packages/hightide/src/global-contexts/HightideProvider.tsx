import type { PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from '@/src/global-contexts/HightideConfigContext'
import { HightideConfigProvider } from '@/src/global-contexts/HightideConfigContext'
import type { HightideLocales, LocalizationProviderProps } from '@/src/global-contexts/LocalizationProvider'
import { LocalizationProvider } from '@/src/global-contexts/LocalizationProvider'
import type { ThemeProviderProps } from '@/src/global-contexts/ThemeProvider'
import { ThemeProvider } from '@/src/global-contexts/ThemeProvider'

type HightideProviderProps<T extends string> = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children'>,
  locale?: Omit<LocalizationProviderProps<T>, 'children'>,
  config?: Omit<HightideConfigProviderProps, 'children'>,
}

export const HightideProvider = <T extends string>({
  children,
  theme,
  locale,
  config,
}: HightideProviderProps<T>) => {
  return (
    <HightideConfigProvider {...config}>
      <LocalizationProvider<T> {...locale} fallbackLocale={locale?.fallbackLocale ?? 'de-DE' as HightideLocales<T>}>
        <ThemeProvider {...theme}>
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </HightideConfigProvider>
  )
}
