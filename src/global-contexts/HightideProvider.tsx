import type { PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from '@/src/global-contexts/HightideConfigContext'
import { HightideConfigProvider } from '@/src/global-contexts/HightideConfigContext'
import type { LocaleProviderProps } from '@/src/global-contexts/LocaleContext'
import { LocaleProvider } from '@/src/global-contexts/LocaleContext'
import type { ThemeProviderProps } from '@/src/global-contexts/ThemeContext'
import { ThemeProvider } from '@/src/global-contexts/ThemeContext'

type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children'>,
  locale?: Omit<LocaleProviderProps, 'children'>,
  config?: Omit<HightideConfigProviderProps, 'children'>,
}

export const HightideProvider = ({
  children,
  theme,
  locale,
  config,
}: HightideProviderProps) => {
  return (
    <LocaleProvider {...locale}>
      <ThemeProvider {...theme}>
        <HightideConfigProvider {...config}>
          {children}
        </HightideConfigProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
