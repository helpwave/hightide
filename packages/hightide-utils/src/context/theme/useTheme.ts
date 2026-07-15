import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import type { ThemeContextValue } from './types'

export const useTheme = <TResolvedTheme extends string = string>(): ThemeContextValue<TResolvedTheme> => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.',
    )
  }
  return context as ThemeContextValue<TResolvedTheme>
}
