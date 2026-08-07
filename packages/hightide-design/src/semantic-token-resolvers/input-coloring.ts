import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type { InputState } from '../component-token-resolvers/input-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'
import { resolveAsFaded } from './with-appearance'
import type { InputColoringTokens } from './types'

const blendBackground = (
  background: ColorToken,
  text: ColorToken,
  alpha: number
): ColorToken => {
  if (background === 'transparent') {
    return HexColorUtils.hexWithAlpha(text as HexColorToken, alpha)
  }

  return HexColorUtils.blendOver(background, text as HexColorToken, alpha)
}

export const resolveInputColoring = (params: {
  themeTokens: ThemeTokens,
  state: InputState,
  color?: ColorPairToken,
}): InputColoringTokens => {
  const { themeTokens, state } = params
  const { tintConfig, disabled, surface, surfaceVariant, negative, primary } = themeTokens.color
  const accentPair = params.color ?? primary

  if (state.isDisabled) {
    return {
      background: disabled.color,
      text: disabled.onColor,
      border: disabled.color,
    }
  }

  let background: ColorToken = surfaceVariant.color
  const text: ColorToken = surface.onColor
  let border: ColorToken = state.isInvalid
    ? negative.color
    : resolveAsFaded({
      themeTokens,
      color: surface.onColor,
    })

  const outline = state.isFocused
    ? (state.isInvalid ? negative.color : accentPair.color)
    : undefined

  let shadow: ColorToken | undefined

  if (state.isPressed || state.isFocused) {
    background = blendBackground(background, text, tintConfig.normal)
    shadow = HexColorUtils.hexWithAlpha(accentPair.color, tintConfig.normal)
  } else if (state.isHovered) {
    background = blendBackground(background, text, tintConfig.light)
    shadow = HexColorUtils.hexWithAlpha(accentPair.color, tintConfig.light)
  }

  if ((state.isHovered || state.isPressed) && !state.isInvalid) {
    border = accentPair.color
  }

  return {
    background,
    text,
    border,
    ...(outline !== undefined ? { outline } : {}),
    ...(shadow !== undefined ? { shadow } : {}),
  }
}
