import type { ColorToken } from '../primitive-tokens/color'
import type { InputState } from '../component-token-resolvers/input-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { resolveAsFaded } from './with-appearance'
import type { InputColoringTokens } from './types'

export const resolveInputColoring = (params: {
  themeTokens: ThemeTokens,
  state: InputState,
  color?: ColorPairToken,
}): InputColoringTokens => {
  const { themeTokens, state } = params
  const { disabled, surface, surfaceVariant, negative, primary } = themeTokens.color
  const accentPair = params.color ?? primary

  if (state.isDisabled) {
    return {
      background: disabled.color,
      text: disabled.onColor,
      border: disabled.color,
    }
  }

  const background: ColorToken = surfaceVariant.color
  const text: ColorToken = surface.onColor
  const border: ColorToken = state.isInvalid
    ? negative.color
    : state.isFocused
      ? accentPair.color
      : resolveAsFaded({
        themeTokens,
        color: surface.onColor,
      })

  return {
    background,
    text,
    border,
  }
}
