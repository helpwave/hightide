import {
  createContext,
  useContext
} from 'react'

import type {
  ThemeConfigValue,
  ThemeInformation
} from '@/src/global-contexts/theme/forward-exports'
import type { Theme } from '@/src/theme/types/theme'

export type { ThemeInformation }

export type ThemeContextValue = ThemeConfigValue<Theme> & {
  isInitialized: boolean,
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
