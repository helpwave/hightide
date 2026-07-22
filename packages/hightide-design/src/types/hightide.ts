import type { AnimationTokens } from './animation'
import type { ColorPaletteBasicToken, ColorPaletteDetailedToken, ColorPaletteSingleValueToken, ColorToken } from './color'
import type { ColoringDefinitionToken } from './coloring'
import type { ComponentColorTokens } from './component-colors'
import type { BorderRadiusToken } from './decoration'
import type { DesignTokens } from './design'
import type { ComponentLayoutTokens } from './layout'
import type { TypographyTokens } from './typography'

export type HightideColorPalleteTokens = {
  white:  ColorPaletteSingleValueToken,
  black: ColorPaletteSingleValueToken,
  gray: ColorPaletteDetailedToken,
  green:  ColorPaletteBasicToken,
  orange: ColorPaletteBasicToken,
  purple:  ColorPaletteBasicToken,
  blue: ColorPaletteBasicToken,
  red: ColorPaletteBasicToken,
}

export type HightideDecorationTokens = {
  borderRadius: {
    xs: BorderRadiusToken,
    sm: BorderRadiusToken,
    md: BorderRadiusToken,
    lg: BorderRadiusToken,
    xl: BorderRadiusToken,
  } & Record<string, BorderRadiusToken>,
}

export type HightideSemanticColorTokens = {
  background: ColorToken,
  onBackground: ColorToken,
  warning: ColorToken,
  onWarning: ColorToken,
  warningHover: ColorToken,
  positive: ColorToken,
  onPositive: ColorToken,
  positiveHover: ColorToken,
  negative: ColorToken,
  onNegative: ColorToken,
  negativeHover: ColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  surface: ColorToken,
  onSurface: ColorToken,
  surfaceHover: ColorToken,
  surfaceVariant: ColorToken,
  onSurfaceVariant: ColorToken,
  surfaceWarning: ColorToken,
  onSurfaceWarning: ColorToken,
  textPrimary: ColorToken,
  textSecondary: ColorToken,
  textTertiary: ColorToken,
  placeholder: ColorToken,
  description: ColorToken,
  label: ColorToken,
  primary: ColorToken,
  onPrimary: ColorToken,
  primaryHover: ColorToken,
  secondary: ColorToken,
  onSecondary: ColorToken,
  secondaryHover: ColorToken,
  neutral: ColorToken,
  onNeutral: ColorToken,
  neutralHover: ColorToken,
  neutralText: ColorToken,
  neutralTextHover: ColorToken,
  neutralOutline: ColorToken,
  neutralOutlineHover: ColorToken,
  neutralTonalText: ColorToken,
  neutralTonalBackground: ColorToken,
  faded: ColorToken,
  highlight: ColorToken,
}

export type HightideColoringTokens = {
  primary: ColoringDefinitionToken,
  secondary: ColoringDefinitionToken,
  positive: ColoringDefinitionToken,
  warning: ColoringDefinitionToken,
  negative: ColoringDefinitionToken,
  neutral: ColoringDefinitionToken,
}

export type HightideDesignTokens = {
  colors: HightideColorPalleteTokens & DesignTokens['colors'],
  semanticColors: HightideSemanticColorTokens & DesignTokens['semanticColors'],
  componentColors: ComponentColorTokens & DesignTokens['componentColors'],
  coloring: HightideColoringTokens & DesignTokens['coloring'],
  typography: TypographyTokens & DesignTokens['typography'],
  layout: ComponentLayoutTokens & DesignTokens['layout'],
  animation: AnimationTokens & DesignTokens['animation'],
  decorcation: HightideDecorationTokens & DesignTokens['decorcation'],
}