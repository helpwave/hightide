import type { HightideColorPalettes } from '../primitive/color'
import { HexColorUtils } from '../utils/hex'
import {
  toHightideThemeBorder,
  toHightideThemePadding,
  toHightideThemePaddingExtension,
  toHightideThemeSize
} from './layout'

import type { ToThemeTokensArgs } from './to-theme-tokens-args'
import type {
  ThemeColorTokens,
  ThemeTokens
} from './theme-tokens'
import { toHightideThemeTypography } from './typography'
import { toHightideThemeShadow } from './shadow'

const toLightThemeColors = (palettes: HightideColorPalettes): ThemeColorTokens => {
  const {
    gray,
    green,
    orange,
    red,
    purple,
    blue,
    white,
    black,
    transparent,
  } = palettes

  return {
    transparent: transparent.value,
    background: gray.value[75],
    onBackground: gray.value[900],
    disabled: gray.value[300],
    onDisabled: gray.value[500],
    surface: gray.value[25],
    onSurface: gray.value[900],
    surfaceHover: white.value,
    surfaceVariant: white.value,
    subtle: gray.value[600],
    faded: gray.value[200],
    primary: {
      color: purple.value[500],
      onColor: white.value,
      emphasis: purple.value[600],
      tint: HexColorUtils.hexWithAlpha(purple.value[500], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(purple.value[500], 0.28),
    },
    secondary: {
      color: blue.value[500],
      onColor: white.value,
      emphasis: blue.value[600],
      tint: HexColorUtils.hexWithAlpha(blue.value[500], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(blue.value[500], 0.28),
    },
    positive: {
      color: green.value[500],
      onColor: white.value,
      emphasis: green.value[600],
      tint: HexColorUtils.hexWithAlpha(green.value[500], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(green.value[500], 0.28),
    },
    warning: {
      color: orange.value[500],
      onColor: white.value,
      emphasis: orange.value[600],
      tint: HexColorUtils.hexWithAlpha(orange.value[500], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(orange.value[500], 0.28),
    },
    negative: {
      color: red.value[500],
      onColor: white.value,
      emphasis: red.value[600],
      tint: HexColorUtils.hexWithAlpha(red.value[500], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(red.value[500], 0.28),
    },
    neutral: {
      color: gray.value[150],
      onColor: black.value,
      emphasis: gray.value[200],
      tint: HexColorUtils.hexWithAlpha(gray.value[300], 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(gray.value[300], 0.28),
    },
  }
}

export const toLightThemeTokens = ({
  primitiveTokens,
}: ToThemeTokensArgs): ThemeTokens => {
  const palettes = primitiveTokens.color.palettes as HightideColorPalettes
  const color = toLightThemeColors(palettes)

  return {
    color,
    spacing: primitiveTokens.spacing,
    size: toHightideThemeSize(primitiveTokens.sizes),
    padding: toHightideThemePadding(),
    paddingExtension: toHightideThemePaddingExtension(primitiveTokens.sizes),
    typography: toHightideThemeTypography(primitiveTokens.typography),
    radius: primitiveTokens.radius,
    border: toHightideThemeBorder(primitiveTokens.border),
    shadow: toHightideThemeShadow(primitiveTokens.shadow),
  }
}
