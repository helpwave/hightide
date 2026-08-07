import type { HexColorToken } from '../primitive-tokens/color'
import type { TintStrength } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'

export const resolveTintedSurface = (params: {
  themeTokens: ThemeTokens,
  tintColor: HexColorToken,
  tintStrength?: TintStrength,
}): HexColorToken => {
  const strength = params.tintStrength ?? 'light'
  const alpha = params.themeTokens.color.tintConfig[strength]
  return HexColorUtils.blendOver(
    params.themeTokens.color.surface.color,
    params.tintColor,
    alpha
  )
}
