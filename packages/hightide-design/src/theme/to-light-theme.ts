import type { HightideColorPalettes } from '../primitive/color'
import { createColorSchemes } from './coloring'
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
    placeholder: gray.value[500],
    description: gray.value[600],
    faded: gray.value[250],
    menuBorder: gray.value[200],
    progressTrack: gray.value[300],
    switchThumbInactive: gray.value[400],
    switchThumbActive: white.value,
    switchBorder: gray.value[200],
    border: gray.value[200],
    divider: gray.value[100],
    primary: purple.value[500],
    onPrimary: white.value,
    primaryHover: purple.value[600],
    secondary: blue.value[500],
    onSecondary: white.value,
    secondaryHover: blue.value[600],
    positive: green.value[500],
    onPositive: white.value,
    positiveHover: green.value[600],
    warning: orange.value[500],
    onWarning: white.value,
    warningHover: orange.value[600],
    negative: red.value[500],
    onNegative: white.value,
    negativeHover: red.value[600],
    neutral: gray.value[150],
    onNeutral: black.value,
    neutralHover: gray.value[200],
    neutralText: black.value,
    neutralTextHover: gray.value[500],
    neutralOutline: black.value,
    neutralOutlineHover: gray.value[600],
    neutralTonalText: black.value,
    neutralTonalBackground: gray.value[300],
  }
}

export const toLightThemeTokens = ({
  primitiveTokens,
}: ToThemeTokensArgs): ThemeTokens => {
  const palettes = primitiveTokens.color.palettes as HightideColorPalettes
  const color = toLightThemeColors(palettes)

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
