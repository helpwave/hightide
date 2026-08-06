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
    base: params.colorPair,
    feedbackSubtle: {
      color: HexColorUtils.blendOver(color, onColor, tintConfig.light),
      onColor: onColor,
    },
    feedbackNormal: {
      color: HexColorUtils.blendOver(color, onColor, tintConfig.normal),
      onColor: onColor,
    },
    feedbackStrong: {
      color: HexColorUtils.blendOver(color, onColor, tintConfig.strong),
      onColor: onColor,
    }
  }
}
