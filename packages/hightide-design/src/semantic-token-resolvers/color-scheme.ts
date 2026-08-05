import { HexColorUtils } from '../utils/hex'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type {
  ColorSchemeToken,
  SemanticTokenResolvers
} from './types'

export const resolveColorScheme = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  colorPair: ColorPairToken,
}): ColorSchemeToken => {
  const { tintConfig } = params.themeTokens.color
  const { color, onColor } = params.colorPair

  return {
    color,
    onColor,
    feedback: {
      subtle: HexColorUtils.blendOver(color, onColor, tintConfig.light),
      onSubtle: color,
      normal: HexColorUtils.blendOver(color, onColor, tintConfig.normal),
      onNormal: color,
      strong: HexColorUtils.blendOver(color, onColor, tintConfig.strong),
      onStrong: color,
    },
  }
}
