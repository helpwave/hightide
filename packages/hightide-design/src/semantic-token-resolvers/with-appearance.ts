import type { HexColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'
import type { SemanticTokenResolvers } from './types'

export type Appearance = 'normal' | 'subtle' | 'faded'

export const resolveWithAppearance = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  color: HexColorToken,
  appearance: Appearance,
}): HexColorToken => (
  HexColorUtils.hexWithAlpha(
    params.color,
    params.themeTokens.decoration.appearancePercentages[params.appearance]
  )
)

export const resolveAsFaded = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  color: HexColorToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    semanticResolvers: params.semanticResolvers,
    color: params.color,
    appearance: 'faded',
  })
)

export const resolveAsDescription = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  color: HexColorToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    semanticResolvers: params.semanticResolvers,
    color: params.color,
    appearance: 'subtle',
  })
)
