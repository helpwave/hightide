import { createContext, useContext } from 'react'
import type { DesignTheme, ThemeMode } from '@helpwave/hightide-design'
import type { ThemeConfigValue, ThemeInformation } from './forward-exports'

export type { ThemeInformation }

export type ThemeContextValue = Omit<ThemeConfigValue, 'theme'> & {
  themeMode: ThemeMode,
  theme: DesignTheme,
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.'
    )
  }
  return context
}
