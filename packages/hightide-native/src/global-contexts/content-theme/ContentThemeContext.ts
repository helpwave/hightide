import {
  createContext,
  useContext
} from 'react'
import type { ColorValue, TextStyle } from 'react-native'

export type ContentThemeContextValue = {
  foregroundColor: ColorValue,
  textStyle: TextStyle,
}

export const ContentThemeContext = createContext<ContentThemeContextValue | null>(null)

export const useContentTheme = (): ContentThemeContextValue => {
  const context = useContext(ContentThemeContext)
  if (!context) {
    throw new Error(
      'useContentTheme must be used within ContentThemeProvider. Try adding a ContentThemeProvider around your app.'
    )
  }
  return context
}
