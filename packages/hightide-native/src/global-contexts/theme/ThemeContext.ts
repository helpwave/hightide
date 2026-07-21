import { createContext, useContext } from 'react'
import type { ThemeConfigValue, ThemeInformation } from './forward-exports'
import type { DesignTheme, ThemeMode } from '../../theme'

export type { ThemeInformation }

export type ThemeContextValue<T extends object = object> = Omit<ThemeConfigValue, 'theme'> & {
  themeMode: ThemeMode,
  theme: DesignTheme<T>,
  isInitialized: boolean,
}

export const ThemeContext = createContext<ThemeContextValue<object> | null>(null)

export const useTheme = <T extends object = object>(): ThemeContextValue<T> => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.'
    )
  }
  return context as ThemeContextValue<T>
}
