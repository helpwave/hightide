import { HexColorUtils } from '../utils/hex'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { ColorSchemeToken } from './types'

export const resolveColorScheme = (params: {
  theme: ThemeTokens,
  parameter: { colorPair: ColorPairToken },
}): ColorSchemeToken => {
  const { tintConfig } = params.theme.color
  const { color, onColor } = params.parameter.colorPair

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
