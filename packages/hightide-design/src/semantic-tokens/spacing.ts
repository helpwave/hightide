import type { HightideThemeTokens } from '../theme-tokens'

export type SemanticSpacingTokens = {
  xs: number,
  sm: number,
  md: number,
  lg: number,
  xl: number,
}

export const toSemanticSpaccingTokens = (themeTokens: HightideThemeTokens) : SemanticSpacingTokens => {
  return themeTokens.spacing
}