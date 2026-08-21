import {
  createContext,
  useContext
} from 'react'
import type { ColorValue, TextStyle } from 'react-native'

import type { IconStyle } from '../../icons'

export type ContentThemeContextValue = {
  foreground: ColorValue,
  background: ColorValue,
  textStyle: TextStyle,
  iconStyle: IconStyle,
}

export const ContentThemeContext = createContext<ContentThemeContextValue | null>(null)

export const useContentTheme = (): ContentThemeContextValue => {
  const context = useContext(ContentThemeContext)
  if (!context) {
    throw new Error(
      'useContentTheme must be used within ContentThemeRootProvider. Try adding a ContentThemeRootProvider around your app.'
    )
  }
  return context
}
