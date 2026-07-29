import type { HightideColorPalettes } from '../primitive/color'
import { HexColorUtils } from '../utils/hex'
import { createColorSchemes } from './color-scheme'
import type { ToThemeTokensArgs } from './to-theme-tokens-args'
import type {
  ThemeColorTokens,
  ThemeTokens
} from './theme-tokens'
import { toHightideThemeTypography } from './typography'
import { toHightideThemeShadow } from './shadow'

const toDarkThemeColors = (palettes: HightideColorPalettes): ThemeColorTokens => {
  const {
    gray,
    green,
    orange,
    red,
    purple,
    blue,
    white,
    transparent,
  } = palettes

  return {
    transparent: transparent.value,
    background: gray.value[850],
    onBackground: gray.value[100],
    disabled: gray.value[500],
    onDisabled: gray.value[300],
    surface: gray.value[800],
    onSurface: gray.value[100],
    surfaceHover: gray.value[700],
    surfaceVariant: gray.value[900],
    placeholder: gray.value[500],
    description: gray.value[400],
    faded: gray.value[650],
    menuBorder: gray.value[600],
    progressTrack: gray.value[700],
    switchThumbInactive: gray.value[400],
    switchThumbActive: gray.value[100],
    switchBorder: gray.value[600],
    border: gray.value[600],
    divider: gray.value[700],
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
}

export const toDarkThemeTokens = ({
  primitiveTokens,
}: ToThemeTokensArgs): ThemeTokens => {
  const palettes = primitiveTokens.color.palettes as HightideColorPalettes
  const color = toDarkThemeColors(palettes)

  return {
    color,
    colorSchemes: createColorSchemes(color),
    spacing: primitiveTokens.spacing,
    elements: primitiveTokens.elements,
    typography: toHightideThemeTypography(primitiveTokens.typography),
    radius: primitiveTokens.radius,
    border: primitiveTokens.border,
    shadow: toHightideThemeShadow(primitiveTokens.shadow),
    motion: primitiveTokens.motion,
  }
}
