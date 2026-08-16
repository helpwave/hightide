import type { HexColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'

export type Appearance = 'normal' | 'subtle' | 'faded'

export const resolveWithAppearance = (params: {
  themeTokens: ThemeTokens,
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
  color: HexColorToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    color: params.color,
    appearance: 'faded',
  })
)

export const resolveAsDescription = (params: {
  themeTokens: ThemeTokens,
  color: HexColorToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    color: params.color,
    appearance: 'subtle',
  })
)
