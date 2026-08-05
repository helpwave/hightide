import type { PressableState } from '../component-token-resolvers/pressable'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type {
  ColorSchemeToken,
  ColoringStyle,
  ColoringTokens,
  SemanticTokenResolvers
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
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  colorScheme: ColorSchemeToken,
  style: ColoringStyle,
  state: ReadonlySet<PressableState>,
}): ColoringTokens => {
  const {
    themeTokens,
    semanticResolvers,
    colorScheme,
    style,
    state,
  } = params

  if (state.has('disabled')) {
    const disabledScheme = semanticResolvers.colorScheme({
      themeTokens,
      semanticResolvers,
      colorPair: themeTokens.color.disabled,
    })
    return baseForStyle(disabledScheme, style)
  }

  let tokens = baseForStyle(colorScheme, style)

  if (state.has('pressed')) {
    tokens = applyFeedback(tokens, colorScheme, style, 'normal')
  } else if (state.has('focused')) {
    tokens = applyFeedback(tokens, colorScheme, style, 'normal')
    tokens.outlineColor = colorScheme.color
  } else if (state.has('hovered')) {
    tokens = applyFeedback(tokens, colorScheme, style, 'subtle')
  }

  return tokens
}
