import {
  useMemo,
  type PropsWithChildren
} from 'react'
import type { ColorValue, TextStyle } from 'react-native'

import type { IconStyle } from '../../icons'
import {
  ContentThemeContext,
  useContentTheme,
  type ContentThemeContextValue
} from './ContentThemeContext'

export type ContentThemeRootProviderProps = PropsWithChildren & ContentThemeContextValue

export const ContentThemeRootProvider = ({
  children,
  foreground,
  background,
  textStyle,
  iconStyle,
}: ContentThemeRootProviderProps) => {
  const value = useMemo((): ContentThemeContextValue => ({
    foreground,
    background,
    textStyle,
    iconStyle,
  }), [foreground, background, textStyle, iconStyle])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}

type ColorOverride =
  | ColorValue
  | ((prev: ColorValue) => ColorValue)

type TextStyleOverride =
  | TextStyle
  | ((prev: TextStyle, foreground: ColorValue) => TextStyle)

type IconStyleOverride =
  | IconStyle
  | ((prev: IconStyle, foreground: ColorValue) => IconStyle)

export type ContentThemeOverrideProviderProps = PropsWithChildren & {
  foreground?: ColorOverride,
  background?: ColorOverride,
  textStyle?: TextStyleOverride,
  iconStyle?: IconStyleOverride,
  isKeepingTextColor?: boolean,
  isKeepingIconColor?: boolean,
}

export const ContentThemeOverrideProvider = ({
  children,
  foreground: foregroundOverride,
  background: backroundOverride,
  textStyle: textStyleOverride,
  iconStyle: iconStyleOverride,
  isKeepingIconColor = false,
  isKeepingTextColor = false,
}: ContentThemeOverrideProviderProps) => {
  const parent = useContentTheme()

  const value = useMemo((): ContentThemeContextValue => {
    const newForeground = typeof foregroundOverride === 'function'
      ? foregroundOverride(parent.foreground)
      : foregroundOverride

    const newBackground = typeof backroundOverride === 'function'
      ? backroundOverride(parent.background)
      : backroundOverride

    const textStyle = typeof textStyleOverride === 'function'
      ? textStyleOverride(parent.textStyle, parent.foreground)
      : textStyleOverride ?? parent.textStyle

    if(!isKeepingTextColor && newForeground !== undefined) textStyle['color'] = newForeground

    const iconStyle = typeof iconStyleOverride === 'function'
      ? iconStyleOverride(parent.iconStyle, parent.foreground)
      : iconStyleOverride ?? parent.iconStyle

    if(!isKeepingIconColor && newForeground !== undefined) iconStyle['color'] = newForeground

    return {
      foreground: newForeground ?? parent.foreground,
      background: newBackground ?? parent.background,
      textStyle,
      iconStyle,
    }
  }, [parent, foregroundOverride, textStyleOverride, iconStyleOverride, backroundOverride, isKeepingTextColor, isKeepingIconColor])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}
