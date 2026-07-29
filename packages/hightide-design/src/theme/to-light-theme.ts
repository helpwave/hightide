import type { HightideColorPalettes } from '../primitive/color'
import { createColoringTokens } from './coloring'
import type { ToThemeTokensArgs } from './to-theme-tokens-args'
import type {
  ThemeColorTokens,
  ThemeTokens
} from './theme-tokens'
import { toHightideThemeTypography } from './typography'

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
    warning: orange.value[500],
    onWarning: white.value,
    warningHover: orange.value[600],
    positive: green.value[500],
    onPositive: white.value,
    positiveHover: green.value[600],
    negative: red.value[500],
    onNegative: white.value,
    negativeHover: red.value[600],
    disabled: gray.value[300],
    onDisabled: gray.value[500],
    surface: gray.value[25],
    onSurface: gray.value[900],
    surfaceHover: white.value,
    surfaceVariant: white.value,
    onSurfaceVariant: gray.value[900],
    surfaceWarning: orange.value[100],
    onSurfaceWarning: orange.value[500],
    textPrimary: gray.value[900],
    textSecondary: gray.value[600],
    textTertiary: gray.value[300],
    placeholder: gray.value[500],
    description: gray.value[600],
    label: gray.value[700],
    primary: purple.value[500],
    onPrimary: white.value,
    primaryHover: purple.value[600],
    secondary: blue.value[500],
    onSecondary: white.value,
    secondaryHover: blue.value[600],
    neutral: gray.value[150],
    onNeutral: black.value,
    neutralHover: gray.value[200],
    neutralText: black.value,
    neutralTextHover: gray.value[500],
    neutralOutline: black.value,
    neutralOutlineHover: gray.value[600],
    neutralTonalText: black.value,
    neutralTonalBackground: gray.value[300],
    faded: gray.value[250],
    highlight: blue.value[500],
    menuBorder: gray.value[200],
    overlayShadow: '#00000038',
    progressTrack: gray.value[300],
    processModelLabelBackground: gray.value[100],
    processModelLabelMuted: purple.value[300],
    processModelTerminalVisited: purple.value[400],
    processModelActivityIcon: purple.value[100],
    processModelActiveRing: purple.value[100],
    processModelActiveBackground: purple.value[50],
    processModelVisitedBorder: purple.value[200],
    processModelVisitedBackground: '#fdf9ff',
    propertyTitleBackground: gray.value[100],
    scrollbarTrack: '#00000033',
    scrollbarThumb: gray.value[600],
    stepperNormal: purple.value[100],
    switchThumbInactive: gray.value[400],
    switchThumbActive: white.value,
    switchBorder: gray.value[200],
    textImageSecondary: blue.value[500],
    textImageDark: blue.value[900],
    textImageOnColor: white.value,
    border: gray.value[200],
    divider: gray.value[100],
    outline: gray.value[100],
    outlineVariant: gray.value[200],
  }
}

export const toLightThemeTokens = ({
  primitiveTokens,
}: ToThemeTokensArgs): ThemeTokens => {
  const palettes = primitiveTokens.color.palettes as HightideColorPalettes
  const color = toLightThemeColors(palettes)

  return {
    color,
    coloring: createColoringTokens(color),
    spacing: primitiveTokens.spacing,
    elements: primitiveTokens.elements,
    typography: toHightideThemeTypography(primitiveTokens.typography),
    radius: primitiveTokens.radius,
    border: primitiveTokens.border,
    shadow: primitiveTokens.shadow,
    motion: primitiveTokens.motion,
    breakpoint: primitiveTokens.breakpoint,
  }
}
