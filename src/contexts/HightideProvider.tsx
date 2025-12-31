import type { PropsWithChildren } from 'react'
import type { HightideConfigProviderProps } from '@/src/contexts/HightideConfigContext'
import { HightideConfigProvider } from '@/src/contexts/HightideConfigContext'
import type { LocaleProviderProps } from '@/src/contexts/LocaleContext'
import { LocaleProvider } from '@/src/contexts/LocaleContext'
import type { ThemeProviderProps } from '@/src/contexts/ThemeContext'
import { ThemeProvider } from '@/src/contexts/ThemeContext'

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
