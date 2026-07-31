import type { HightideThemeTokens } from '../theme-tokens'

export type SemanticBorderRadiusTokens = {
  xs: number,
  sm: number,
  md: number,
  lg: number,
  xl: number,
}

export const toSemanticBorderRadiusTokens = (themeTokens: HightideThemeTokens) : SemanticBorderRadiusTokens => {
  return themeTokens.borderRadius
}