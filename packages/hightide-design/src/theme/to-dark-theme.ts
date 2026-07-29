import type { HightideColorPalettes } from '../primitive/color'
import { createColorSchemes } from './coloring'
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
    primary: purple.value[400],
    onPrimary: white.value,
    primaryHover: purple.value[500],
    secondary: blue.value[500],
    onSecondary: white.value,
    secondaryHover: blue.value[600],
    positive: green.value[700],
    onPositive: white.value,
    positiveHover: green.value[600],
    warning: orange.value[500],
    onWarning: white.value,
    warningHover: orange.value[600],
    negative: red.value[500],
    onNegative: white.value,
    negativeHover: red.value[600],
    neutral: gray.value[750],
    onNeutral: white.value,
    neutralHover: gray.value[600],
    neutralText: white.value,
    neutralTextHover: gray.value[500],
    neutralOutline: gray.value[200],
    neutralOutlineHover: gray.value[400],
    neutralTonalText: white.value,
    neutralTonalBackground: gray.value[400],
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
