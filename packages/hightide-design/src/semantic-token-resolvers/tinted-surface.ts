import type { HexColorToken } from '../primitive-tokens/color'
import type { TintStrength } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'

export const resolveTintedSurface = (params: {
  theme: ThemeTokens,
  parameter: {
    tintColor: HexColorToken,
    tintStrength?: TintStrength,
  },
}): HexColorToken => {
  const strength = params.parameter.tintStrength ?? 'light'
  const alpha = params.theme.color.tintConfig[strength]
  return HexColorUtils.blendOver(
    params.theme.color.surface.color,
    params.parameter.tintColor,
    alpha
  )
}
