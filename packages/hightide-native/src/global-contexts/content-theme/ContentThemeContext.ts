import {
  createContext,
  useContext
} from 'react'
import type { TextStyle } from 'react-native'

import type { HexColor } from '../../theme/types/color'

import type { IconStyle } from '../../icons'

export type ContentThemeContextValue = Readonly<{
  foreground: HexColor,
  background: HexColor,
  textStyle: Readonly<TextStyle>,
  iconStyle: Readonly<IconStyle>,
}>

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
