import {
  createContext,
  useContext
} from 'react'
import type { TextStyle } from 'react-native'

import type { Color } from '../../theme/types/color'

export type ContentThemeContextValue = {
  foregroundColor: Color,
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
