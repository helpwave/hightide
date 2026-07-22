import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import {
  componentLayouts,
  fontWeights
} from '@helpwave/hightide-design/tokens'
import type {
  HightideDesignTokens as DesignTokensTheme,
  ElementSize
} from '@helpwave/hightide-design/types'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from '@/src/theme/resolvers/coloring'
import type { HightideSemanticColors } from '@/src/theme/types/color'
import type {
  ButtonState,
  ButtonTheme
} from '@/src/theme/types/components/button'
import type { HightideComponentThemes } from '@/src/theme/types/components/hightide'
import { createStyleResolver } from '@/src/theme/types/resolver'

const buttonFontSizes: Record<ElementSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
}

export type CreateButtonThemeOptions = {
  semantic: HightideSemanticColors,
  coloring: HightideComponentThemes['coloring'],
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

    const button: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: outlinePadding ? padding.paddingYOutline : padding.paddingY,
      paddingHorizontal: outlinePadding ? padding.paddingXOutline : padding.paddingX,
      gap: padding.gap,
      minWidth: padding.minWidth,
      minHeight: sizing.height,
      borderRadius: padding.borderRadius,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: buttonFontSizes[size],
      fontWeight: fontWeights.semibold,
    }

    return { button, text }
  }

  return {
    button: createStyleResolver((state) => resolveState(state).button),
    text: createStyleResolver((state) => resolveState(state).text),
  }
}

export const createButtonThemeFromDesign = (theme: DesignTokensTheme): ButtonTheme => {
  return createButtonTheme({
    semantic: theme.semanticColors,
    coloring: theme.coloring as HightideComponentThemes['coloring'],
  })
}
