import {
  useMemo,
  type PropsWithChildren
} from 'react'
import type { ColorValue, TextStyle } from 'react-native'

import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'

import type { IconStyle } from '../../icons'
import { HexColorUtils } from '../../utils/hex'
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
  | ((prev: HexColorToken) => ColorValue)

type TextStyleOverride =
  | TextStyle
  | ((prev: TextStyle, foreground: HexColorToken) => TextStyle)

type IconStyleOverride =
  | IconStyle
  | ((prev: IconStyle, foreground: HexColorToken) => IconStyle)

export type ContentThemeOverrideProviderProps = PropsWithChildren & {
  foreground?: ColorOverride,
  background?: ColorOverride,
  textStyle?: TextStyleOverride,
  iconStyle?: IconStyleOverride,
  isKeepingTextColor?: boolean,
  isKeepingIconColor?: boolean,
}

const resolveColorOverride = (
  override: ColorOverride | undefined,
  previous: HexColorToken
): HexColorToken | undefined => {
  if (override === undefined) {
    return undefined
  }

  const raw = typeof override === 'function' ? override(previous) : override
  return HexColorUtils.tryParseColorValue(raw)
}

export const ContentThemeOverrideProvider = ({
  children,
  foreground: foregroundOverride,
  background: backgroundOverride,
  textStyle: textStyleOverride,
  iconStyle: iconStyleOverride,
  isKeepingIconColor = false,
  isKeepingTextColor = false,
}: ContentThemeOverrideProviderProps) => {
  const parent = useContentTheme()

  const value = useMemo((): ContentThemeContextValue => {
    const newForeground = resolveColorOverride(foregroundOverride, parent.foreground)
    const newBackground = resolveColorOverride(backgroundOverride, parent.background)

    const resolvedTextStyleOverride = typeof textStyleOverride === 'function'
      ? textStyleOverride(parent.textStyle, parent.foreground)
      : textStyleOverride

    let textStyle = resolvedTextStyleOverride ?? parent.textStyle

    if (!isKeepingTextColor && newForeground !== undefined) {
      textStyle = { ...textStyle, color: resolvedTextStyleOverride?.color ?? newForeground }
    }

    const resolvedIconStyleOverride = typeof iconStyleOverride === 'function'
      ? iconStyleOverride(parent.iconStyle, parent.foreground)
      : iconStyleOverride ?? parent.iconStyle

    let iconStyle = resolvedIconStyleOverride ?? parent.iconStyle

    if (!isKeepingIconColor && newForeground !== undefined) {
      iconStyle = { ...iconStyle, color: resolvedIconStyleOverride?.color ?? newForeground }
    }

    return {
      foreground: newForeground ?? parent.foreground,
      background: newBackground ?? parent.background,
      textStyle,
      iconStyle,
    }
  }, [parent, foregroundOverride, textStyleOverride, iconStyleOverride, backgroundOverride, isKeepingTextColor, isKeepingIconColor])

  return (
    <ContentThemeContext.Provider value={value}>
      {children}
    </ContentThemeContext.Provider>
  )
}
