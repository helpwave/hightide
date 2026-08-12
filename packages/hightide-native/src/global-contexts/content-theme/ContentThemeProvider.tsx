import {
  useMemo,
  type PropsWithChildren
} from 'react'
import type { TextStyle, ColorValue } from 'react-native'

import {
  ContentThemeContext,
  type ContentThemeContextValue
} from './ContentThemeContext'

export type ContentThemeProviderProps = PropsWithChildren & {
  foregroundColor: ColorValue,
  textStyle: TextStyle,
}

export const ContentThemeProvider = ({
  children,
  foregroundColor,
  textStyle,
}: ContentThemeProviderProps) => {
  const value = useMemo((): ContentThemeContextValue => ({
    foregroundColor,
    textStyle,
  }), [foregroundColor, textStyle])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}
