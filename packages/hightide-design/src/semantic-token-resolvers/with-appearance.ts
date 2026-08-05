import type { HexColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'

export type Appearance = 'normal' | 'subtle' | 'faded'

export const resolveWithAppearance = (params: {
  theme: ThemeTokens,
  parameter: {
    color: HexColorToken,
    appearance: Appearance,
  },
}): HexColorToken => (
  HexColorUtils.hexWithAlpha(
    params.parameter.color,
    params.theme.decoration.appearancePercentages[params.parameter.appearance]
  )
)

export const resolveAsFaded = (params: {
  theme: ThemeTokens,
  parameter: {
    color: HexColorToken,
  },
}): HexColorToken => (
  resolveWithAppearance({
    theme: params.theme,
    parameter: {
      color: params.parameter.color,
      appearance: 'faded',
    },
  })
)

export const resolveAsDescription = (params: {
  theme: ThemeTokens,
  parameter: {
    color: HexColorToken,
  },
}): HexColorToken => (
  resolveWithAppearance({
    theme: params.theme,
    parameter: {
      color: params.parameter.color,
      appearance: 'subtle',
    },
  })
)
