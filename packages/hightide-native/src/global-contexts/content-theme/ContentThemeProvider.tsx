import {
  useMemo,
  type PropsWithChildren
} from 'react'
import type { TextStyle } from 'react-native'

import type { Color } from '../../theme/types/color'
import {
  ContentThemeContext,
  type ContentThemeContextValue
} from './ContentThemeContext'

export type ContentThemeProviderProps = PropsWithChildren & {
  foregroundColor: Color,
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
