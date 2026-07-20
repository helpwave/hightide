import {
  componentLayouts,
  toPx,
  type ColoringTokensDefinitions,
  type DesignTheme as DesignTokensTheme,
  type ElementSize,
  type SemanticColors
} from '@helpwave/hightide-design'
import type { ButtonState, ButtonStyle, ButtonTextStyle, ButtonTheme } from '../types'
import { isOutlineColoringStyle, resolveColoringStyles } from './coloring'

const buttonFontSizes: Record<ElementSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
}

export type CreateButtonThemeOptions = {
  semantic: SemanticColors,
  coloring: ColoringTokensDefinitions,
}

export const createButtonTheme = ({
  semantic,
  coloring,
}: CreateButtonThemeOptions): ButtonTheme => {
  const resolveState = (state: ButtonState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'primary'
    const coloringStyle = state.coloringStyle ?? 'solid'
    const tokens = coloring[color]
    const resolved = resolveColoringStyles(tokens, coloringStyle, semantic, state)
    const padding = componentLayouts.button[size]
    const sizing = componentLayouts.element[size]
    const outlinePadding = isOutlineColoringStyle(coloringStyle)

    const button: ButtonStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: toPx(outlinePadding ? padding.paddingYOutline : padding.paddingY),
      paddingHorizontal: toPx(outlinePadding ? padding.paddingXOutline : padding.paddingX),
      gap: toPx(padding.gap),
      minWidth: toPx(padding.minWidth),
      minHeight: toPx(sizing.height),
      borderRadius: toPx(padding.borderRadius),
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: ButtonTextStyle = {
      color: resolved.color,
      fontSize: buttonFontSizes[size],
      fontWeight: '600',
    }

    return { button, text }
  }

  return {
    button: (state) => resolveState(state).button,
    text: (state) => resolveState(state).text,
  }
}

export const createButtonThemeFromDesign = (theme: DesignTokensTheme): ButtonTheme => {
  return createButtonTheme({
    semantic: theme.semantic,
    coloring: theme.coloring,
  })
}
