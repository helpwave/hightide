import { palette } from './palette'

/**
 * Semantic (role-based) colors for the helpwave design language.
 *
 * These map the raw {@link palette} onto the roles that components actually
 * consume (primary, surface, on-surface, …). They are transcribed from the web
 * library's `colors/semantic.css` and `colors/component.css`, resolved to
 * concrete palette values for each color scheme.
 *
 * On the web these live as CSS custom properties that get swapped under
 * `[data-theme=dark]`. On native there is no cascade, so we resolve both
 * schemes ahead of time and pick one at runtime via the theme provider.
 */
export type SemanticColors = {
  // Brand / state roles ------------------------------------------------------
  primary: string,
  onPrimary: string,
  primaryHover: string,

  secondary: string,
  onSecondary: string,
  secondaryHover: string,

  positive: string,
  onPositive: string,
  positiveHover: string,

  warning: string,
  onWarning: string,
  warningHover: string,

  negative: string,
  onNegative: string,
  negativeHover: string,

  neutral: string,
  onNeutral: string,
  neutralHover: string,
  neutralText: string,
  neutralTextHover: string,
  neutralOutline: string,
  neutralOutlineHover: string,
  neutralTonalText: string,
  neutralTonalBackground: string,

  disabled: string,
  onDisabled: string,

  // Surfaces -----------------------------------------------------------------
  background: string,
  onBackground: string,
  surface: string,
  onSurface: string,
  surfaceHover: string,
  surfaceVariant: string,
  surfaceWarning: string,

  // Text ---------------------------------------------------------------------
  textPrimary: string,
  textSecondary: string,
  textTertiary: string,
  textHighlight: string,
  placeholder: string,
  description: string,
  label: string,
  highlight: string,

  // Lines / focus ------------------------------------------------------------
  border: string,
  divider: string,
  focus: string,
  outline: string,
  outlineVariant: string,

  // Component specific -------------------------------------------------------
  inputBackground: string,
  inputText: string,
  progressIndicatorFill: string,
  progressIndicatorBackground: string,
  switchThumbInactive: string,
  switchThumbActive: string,
  tooltipBackground: string,
  tooltipText: string,
  overlayBackground: string,
  overlayText: string,
}

export const lightColors: SemanticColors = {
  primary: palette.purple[500],
  onPrimary: palette.white,
  primaryHover: palette.purple[600],

  secondary: palette.blue[500],
  onSecondary: palette.white,
  secondaryHover: palette.blue[600],

  positive: palette.green[500],
  onPositive: palette.white,
  positiveHover: palette.green[600],

  warning: palette.orange[500],
  onWarning: palette.white,
  warningHover: palette.orange[600],

  negative: palette.red[500],
  onNegative: palette.white,
  negativeHover: palette.red[600],

  neutral: palette.gray[150],
  onNeutral: palette.black,
  neutralHover: palette.gray[200],
  neutralText: palette.black,
  neutralTextHover: palette.gray[500],
  neutralOutline: palette.black,
  neutralOutlineHover: palette.gray[600],
  neutralTonalText: palette.black,
  neutralTonalBackground: palette.gray[300],

  disabled: palette.gray[300],
  onDisabled: palette.gray[500],

  background: palette.gray[75],
  onBackground: palette.gray[900],
  surface: palette.gray[25],
  onSurface: palette.gray[900],
  surfaceHover: palette.white,
  surfaceVariant: palette.white,
  surfaceWarning: palette.orange[100],

  textPrimary: palette.gray[900],
  textSecondary: palette.gray[600],
  textTertiary: palette.gray[300],
  textHighlight: palette.blue[500],
  placeholder: palette.gray[500],
  description: palette.gray[600],
  label: palette.gray[700],
  highlight: palette.blue[500],

  border: palette.gray[200],
  divider: palette.gray[100],
  focus: palette.purple[500],
  outline: palette.gray[100],
  outlineVariant: palette.gray[200],

  inputBackground: palette.white,
  inputText: palette.gray[900],
  progressIndicatorFill: palette.purple[500],
  progressIndicatorBackground: palette.gray[300],
  switchThumbInactive: palette.gray[900],
  switchThumbActive: palette.white,
  tooltipBackground: palette.white,
  tooltipText: palette.gray[600],
  overlayBackground: palette.gray[25],
  overlayText: palette.gray[900],
}

export const darkColors: SemanticColors = {
  primary: palette.purple[400],
  onPrimary: palette.white,
  primaryHover: palette.purple[500],

  secondary: palette.blue[500],
  onSecondary: palette.white,
  secondaryHover: palette.blue[600],

  positive: palette.green[700],
  onPositive: palette.white,
  positiveHover: palette.green[600],

  warning: palette.orange[500],
  onWarning: palette.white,
  warningHover: palette.orange[600],

  negative: palette.red[500],
  onNegative: palette.white,
  negativeHover: palette.red[600],

  neutral: palette.gray[750],
  onNeutral: palette.white,
  neutralHover: palette.gray[600],
  neutralText: palette.white,
  neutralTextHover: palette.gray[500],
  neutralOutline: palette.gray[200],
  neutralOutlineHover: palette.gray[400],
  neutralTonalText: palette.white,
  neutralTonalBackground: palette.gray[400],

  disabled: palette.gray[500],
  onDisabled: palette.gray[300],

  background: palette.gray[850],
  onBackground: palette.gray[100],
  surface: palette.gray[800],
  onSurface: palette.gray[100],
  surfaceHover: palette.gray[700],
  surfaceVariant: palette.gray[900],
  surfaceWarning: palette.orange[900],

  textPrimary: palette.gray[100],
  textSecondary: palette.gray[400],
  textTertiary: palette.gray[600],
  textHighlight: palette.blue[500],
  placeholder: palette.gray[500],
  description: palette.gray[400],
  label: palette.gray[300],
  highlight: palette.blue[500],

  border: palette.gray[600],
  divider: palette.gray[700],
  focus: palette.purple[400],
  outline: palette.gray[700],
  outlineVariant: palette.gray[600],

  inputBackground: palette.gray[900],
  inputText: palette.gray[100],
  progressIndicatorFill: palette.purple[400],
  progressIndicatorBackground: palette.gray[700],
  switchThumbInactive: palette.gray[100],
  switchThumbActive: palette.gray[100],
  tooltipBackground: palette.gray[900],
  tooltipText: palette.gray[400],
  overlayBackground: palette.gray[800],
  overlayText: palette.gray[100],
}

export type ColorSchemeName = 'light' | 'dark'

export const colorSchemes: Record<ColorSchemeName, SemanticColors> = {
  light: lightColors,
  dark: darkColors,
}

export type SemanticColorName = keyof SemanticColors
