import type { HexColorToken } from '../primitive-tokens/color'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'

export type Appearance = 'normal' | 'subtle' | 'faded'

export const resolveWithAppearance = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  appearance: Appearance,
}): HexColorToken => (
  HexColorUtils.blend(
    params.colorPair.color,
    HexColorUtils.hexWithAlpha(
      params.colorPair.onColor,
      params.themeTokens.config.appearancePercentages[params.appearance]
    )
  )
)

export const resolveAsFaded = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    colorPair: params.colorPair,
    appearance: 'faded',
  })
)

export const resolveAsDescription = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    colorPair: params.colorPair,
    appearance: 'subtle',
  })
)
