import { toPx } from '@helpwave/hightide-design/helpers'
import { componentLayouts } from '@helpwave/hightide-design/tokens'
import {
  type ColoringDefintionTokens,
  type DesignTokens as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design/types'
import type { ViewStyle } from 'react-native'
import type { IconButtonState, IconButtonTheme } from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'
import { isOutlineColoringStyle, resolveColoringStyles } from './coloring'

export type CreateIconButtonThemeOptions = {
  semantic: SemanticColors,
  coloring: ColoringDefintionTokens,
}

export const createIconButtonTheme = ({
  semantic,
  coloring,
}: CreateIconButtonThemeOptions): IconButtonTheme => {
  const resolveState = (state: IconButtonState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'solid'
    const tokens = coloring[color]
    const resolved = resolveColoringStyles(tokens, coloringStyle, semantic, state)
    const sizing = componentLayouts.element[size]
    const outlineWidth = toPx(componentLayouts.shared.coloringOutlineWidth)
    const dimension = toPx(sizing.height)
    const borderWidth = resolved.borderWidth > 0
      ? resolved.borderWidth
      : (isOutlineColoringStyle(coloringStyle) ? outlineWidth : 0)

    const button: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth,
      width: dimension,
      height: dimension,
      borderRadius: toPx(componentLayouts.button[size].borderRadius),
      opacity: state.isDisabled ? 0.6 : 1,
    }

    return {
      button,
      icon: { color: resolved.color },
    }
  }

  return {
    button: createStyleResolver((state) => resolveState(state).button),
    icon: createValueResolver((state) => resolveState(state).icon),
  }
}

export const createIconButtonThemeFromDesign = (theme: DesignTokensTheme): IconButtonTheme => {
  return createIconButtonTheme({
    semantic: theme.semantic,
    coloring: theme.coloring,
  })
}
