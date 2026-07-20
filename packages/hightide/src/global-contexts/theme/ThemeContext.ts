import { createContext, useContext } from 'react'
import type { ThemeConfigValue } from './forward-exports'

export type { ThemeConfigValue as ThemeContextValue, ThemeInformation } from './forward-exports'

export const ThemeContext = createContext<ThemeConfigValue | null>(null)

export const useTheme = (): ThemeConfigValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.'
    )
  }
  return context
}
