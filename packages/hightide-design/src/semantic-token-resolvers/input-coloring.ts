import type { ColorToken } from '../primitive-tokens/color'
import type { InputState } from '../component-token-resolvers/input-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { InputColoringTokens } from './types'

export const resolveInputColoring = (params: {
  themeTokens: ThemeTokens,
  state: InputState,
  color?: ColorPairToken,
}): InputColoringTokens => {
  const { themeTokens, state } = params
  const { disabled, surface, surfaceVariant, negative, primary } = themeTokens.color
  const accentPair = params.color ?? primary

  if (state.has('disabled')) {
    return {
      background: disabled.color,
      text: disabled.onColor,
      border: 'transparent',
    }
  }

  const background: ColorToken = surfaceVariant.color
  const text: ColorToken = surface.onColor
  const border: ColorToken = state.has('invalid')
    ? negative.color
    : state.has('focused')
      ? accentPair.color
      : themeTokens.color.border

  return {
    background,
    text,
    border,
  }
}
