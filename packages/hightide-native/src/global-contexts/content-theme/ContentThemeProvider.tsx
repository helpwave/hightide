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
  textStyle,
  iconStyle,
}: ContentThemeRootProviderProps) => {
  const value = useMemo((): ContentThemeContextValue => ({
    foreground,
    textStyle,
    iconStyle,
  }), [foreground, textStyle, iconStyle])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}

type ForegroundOverride =
  | ColorValue
  | ((prev: ColorValue) => ColorValue)

type TextStyleOverride =
  | TextStyle
  | ((prev: TextStyle, foreground: ColorValue) => TextStyle)

type IconStyleOverride =
  | IconStyle
  | ((prev: IconStyle, foreground: ColorValue) => IconStyle)

export type ContentThemeOverrideProviderProps = PropsWithChildren & {
  foreground?: ForegroundOverride,
  textStyle?: TextStyleOverride,
  iconStyle?: IconStyleOverride,
}

export const ContentThemeOverrideProvider = ({
  children,
  foreground: foregroundOverride,
  textStyle: textStyleOverride,
  iconStyle: iconStyleOverride,
}: ContentThemeOverrideProviderProps) => {
  const parent = useContentTheme()

  const value = useMemo((): ContentThemeContextValue => {
    const foreground = typeof foregroundOverride === 'function'
      ? foregroundOverride(parent.foreground)
      : foregroundOverride ?? parent.foreground

    const textStyle = typeof textStyleOverride === 'function'
      ? textStyleOverride(parent.textStyle, foreground)
      : textStyleOverride ?? parent.textStyle

    const iconStyle = typeof iconStyleOverride === 'function'
      ? iconStyleOverride(parent.iconStyle, foreground)
      : iconStyleOverride ?? parent.iconStyle

    return {
      foreground,
      textStyle,
      iconStyle,
    }
  }, [parent, foregroundOverride, textStyleOverride, iconStyleOverride])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}
