import type { PressableState } from '../component-token-resolvers/pressable'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { resolveColorScheme } from './color-scheme'
import type {
  ColorSchemeToken,
  ColoringStyle,
  ColoringTokens
} from './types'

const baseForStyle = (
  scheme: ColorSchemeToken,
  style: ColoringStyle
): ColoringTokens => {
  switch (style) {
  case 'filled':
    return {
      color: scheme.color,
      onColor: scheme.onColor,
      borderColor: scheme.color,
    }
  case 'outline':
    return {
      color: 'transparent',
      onColor: scheme.color,
      outlineColor: scheme.color,
    }
  case 'tonal':
    return {
      color: scheme.feedback.normal,
      onColor: scheme.feedback.onNormal ?? scheme.color,
      borderColor: scheme.feedback.normal,
    }
  case 'tonal-outline':
    return {
      color: scheme.feedback.normal,
      onColor: scheme.feedback.onNormal ?? scheme.color,
      borderColor: scheme.feedback.normal,
      outlineColor: scheme.color,
    }
  case 'text':
    return {
      color: 'transparent',
      onColor: scheme.color,
    }
  }
}

const applyFeedback = (
  tokens: ColoringTokens,
  scheme: ColorSchemeToken,
  style: ColoringStyle,
  feedback: 'subtle' | 'normal'
): ColoringTokens => {
  const surface = feedback === 'subtle' ? scheme.feedback.subtle : scheme.feedback.normal
  const onSurface = feedback === 'subtle'
    ? (scheme.feedback.onSubtle ?? scheme.color)
    : (scheme.feedback.onNormal ?? scheme.color)

  switch (style) {
  case 'filled':
    return {
      color: surface,
      onColor: scheme.onColor,
    }
  case 'outline':
    return {
      color: 'transparent',
      onColor: onSurface,
      borderColor: onSurface,
    }
  case 'tonal':
    return {
      color: surface,
      onColor: onSurface,
    }
  case 'tonal-outline':
    return {
      color: surface,
      onColor: onSurface,
      borderColor: surface,
    }
  case 'text':
    return {
      color: 'transparent',
      onColor: onSurface,
    }
  }
}

export const resolveColoringStyle = (params: {
  theme: ThemeTokens,
  parameter: {
    colorScheme: ColorSchemeToken,
    style: ColoringStyle,
    state: ReadonlySet<PressableState>,
  },
}): ColoringTokens => {
  const { theme, parameter } = params
  const { style, state } = parameter

  if (state.has('disabled')) {
    const disabledScheme = resolveColorScheme({
      theme,
      parameter: { colorPair: theme.color.disabled },
    })
    return baseForStyle(disabledScheme, style)
  }

  let tokens = baseForStyle(parameter.colorScheme, style)

  if (state.has('pressed')) {
    tokens = applyFeedback(tokens, parameter.colorScheme, style, 'normal')
  } else if (state.has('focused')) {
    tokens = applyFeedback(tokens, parameter.colorScheme, style, 'normal')
    tokens.outlineColor = parameter.colorScheme.color
  } else if (state.has('hovered')) {
    tokens = applyFeedback(tokens, parameter.colorScheme, style, 'subtle')
  }

  return tokens
}
