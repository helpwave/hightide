import type { HightideThemeTokens } from '../theme-tokens'

export type SemanticBorderWidthTokens = {
  thin: number,
  normal: number,
  thick: number,
}

export const toSemanticBorderWidthTokens = (themeTokens: HightideThemeTokens) : SemanticBorderWidthTokens => {
  return themeTokens.borderWidth
}