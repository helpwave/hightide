import type { HightideColorPalettes } from '../primitive-tokens/color'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import { HexColorUtils } from '../utils/hex'
import type { HightideThemeTokens } from './themeTokens'
import {
  hightideThemeBorderRadiusTokens,
  hightideThemeBorderWidthTokens,
  hightideThemePaddingExtensionTokens,
  hightideThemePaddingTokens,
  hightideThemeSizeTokens,
  hightideThemeSpacingTokens
} from './layout'
import {
  hightideDarkThemeShadowTokens,
  hightideLightThemeShadowTokens
} from './shadow'
import { hightideThemeTypographyTokens } from './typography'
import type { HightideThemeColorTokens } from './color'

export type HightideSharedThemeTokens = Omit<HightideThemeTokens, 'colors' | 'shadow'>

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

export const hightideSharedThemeTokens: HightideSharedThemeTokens = {
  spacing: hightideThemeSpacingTokens,
  size: hightideThemeSizeTokens,
  padding: hightideThemePaddingTokens,
  paddingExtension: hightideThemePaddingExtensionTokens,
  typography: hightideThemeTypographyTokens,
  borderRadius: hightideThemeBorderRadiusTokens,
  borderWidth: hightideThemeBorderWidthTokens,
}

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

const hightideLightThemeColors: HightideThemeColorTokens = {
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

const hightideDarkThemeColors: HightideThemeColorTokens = {
  transparent: transparent.value,
  background: gray.value[850],
  onBackground: gray.value[100],
  disabled: gray.value[500],
  onDisabled: gray.value[300],
  surface: gray.value[800],
  onSurface: gray.value[100],
  surfaceHover: gray.value[700],
  surfaceVariant: gray.value[900],
  subtle: gray.value[400],
  faded: gray.value[600],
  primary: {
    color: purple.value[400],
    onColor: white.value,
    emphasis: purple.value[500],
    tint: HexColorUtils.hexWithAlpha(purple.value[400], 0.2),
    tintEmphasis: HexColorUtils.hexWithAlpha(purple.value[400], 0.28),
  },
  secondary: {
    color: blue.value[500],
    onColor: white.value,
    emphasis: blue.value[600],
    tint: HexColorUtils.hexWithAlpha(blue.value[500], 0.2),
    tintEmphasis: HexColorUtils.hexWithAlpha(blue.value[500], 0.28),
  },
  positive: {
    color: green.value[700],
    onColor: white.value,
    emphasis: green.value[600],
    tint: HexColorUtils.hexWithAlpha(green.value[700], 0.2),
    tintEmphasis: HexColorUtils.hexWithAlpha(green.value[700], 0.28),
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
    color: gray.value[750],
    onColor: white.value,
    emphasis: gray.value[600],
    tint: HexColorUtils.hexWithAlpha(gray.value[400], 0.2),
    tintEmphasis: HexColorUtils.hexWithAlpha(gray.value[400], 0.28),
  },
}

export const hightideLightThemeTokens: HightideThemeTokens = {
  ...hightideSharedThemeTokens,
  colors: hightideLightThemeColors,
  shadow: hightideLightThemeShadowTokens,
}

export const hightideDarkThemeTokens: HightideThemeTokens = {
  ...hightideSharedThemeTokens,
  colors: hightideDarkThemeColors,
  shadow: hightideDarkThemeShadowTokens,
}
