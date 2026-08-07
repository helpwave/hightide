import type { PressableState } from '../component-token-resolvers/pressable'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils'
import { OKLCHUtils } from '../utils/oklch'
import { resolveColorScheme } from './color-scheme'
import type {
  ColorSchemeToken,
  ColoringStyle,
  ColoringTokens
} from './types'

const applyFeedback = (
  scheme: ColorSchemeToken,
  style: ColoringStyle,
  feedbackType: keyof ColorSchemeToken = 'base'
): ColoringTokens => {
  const color = scheme[feedbackType].color
  const onColor = scheme[feedbackType].onColor

  switch (style) {
  case 'filled':
    return {
      color: color,
      onColor: onColor,
    }
  case 'outline':
    return {
      color: 'transparent',
      onColor: color,
      borderColor: color,
    }
  case 'tonal':
    return {
      color: color,
      onColor: onColor,
    }
  case 'tonal-outline':
    return {
      color: color,
      onColor: onColor,
      borderColor: OKLCHUtils.changeLightness(scheme.base.color, 0.8),
    }
  case 'text':
    return {
      color: 'transparent',
      onColor: color,
    }
  }
}

export const resolveColoringStyle = (params: {
  themeTokens: ThemeTokens,
  colorScheme: ColorSchemeToken,
  style: ColoringStyle,
  state: ReadonlySet<PressableState>,
}): ColoringTokens => {
  const {
    themeTokens,
    colorScheme,
    style,
    state,
  } = params

  if (state.has('disabled')) {
    const disabledScheme = resolveColorScheme({
      themeTokens,
      colorPair: themeTokens.color.disabled,
    })
    return applyFeedback(disabledScheme, style)
  }

  let tokens: ColoringTokens

  if (state.has('pressed')) {
    tokens = applyFeedback(colorScheme, style, 'feedbackNormal')
    if(style === 'text' || style === 'outline') {
      tokens.color = HexColorUtils.hexWithAlpha(colorScheme.feedbackNormal.color, 0.25)
    }
  } else if (state.has('focused')) {
    tokens = applyFeedback(colorScheme, style, 'feedbackNormal')
    tokens.outlineColor = colorScheme.base.color
    if(style === 'text' || style === 'outline') {
      tokens.color = HexColorUtils.hexWithAlpha(colorScheme.feedbackNormal.color, 0.25)
    }
    if(style === 'tonal' || style === 'tonal-outline') {
      tokens.outlineColor = colorScheme.base.onColor
    }
  } else if (state.has('hovered')) {
    tokens = applyFeedback(colorScheme, style, 'feedbackSubtle')
    if(style === 'text' || style === 'outline') {
      tokens.color = HexColorUtils.hexWithAlpha(colorScheme.feedbackNormal.color, 0.10)
    }
  } else {
    tokens = applyFeedback(colorScheme, style)
  }

  return tokens
}
