import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import {
  hightideBorder,
  hightideElements,
  hightideRadius,
  hightideSpacing,
  hightideTypography,
  type ElementSize
} from '@helpwave/hightide-design/primitive'
import type { HightideThemeTokens as DesignTokensTheme } from '@helpwave/hightide-design/theme'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from './coloring'
import type { HightideSemanticColors } from '../types/color'
import type {
  ButtonState,
  ButtonTheme
} from '../types/components/button'
import type { HightideComponentThemes } from '../types/components/hightide'
import { createStyleResolver } from '../types/resolver'

const buttonFontSizes: Record<ElementSize, number> = {
  xs: Number(hightideTypography.fontSize.xs),
  sm: Number(hightideTypography.fontSize.sm),
  md: Number(hightideTypography.fontSize.sm),
  lg: Number(hightideTypography.fontSize.lg),
  xl: Number(hightideTypography.fontSize.xl),
}

const buttonMinWidths: Record<ElementSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
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
    const element = hightideElements[size]
    const outlinePadding = isOutlineColoringStyle(coloringStyle)
    const outlineInset = Math.max(element.inset - hightideBorder.base, 0)
    const horizontalInset = size === 'xs' || size === 'sm'
      ? element.inset + hightideSpacing.xs
      : element.inset + hightideSpacing.md

    const button: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: outlinePadding ? outlineInset : element.inset,
      paddingHorizontal: outlinePadding
        ? Math.max(horizontalInset - hightideBorder.base, 0)
        : horizontalInset,
      gap: size === 'xs' || size === 'sm' ? hightideSpacing.xs : hightideSpacing.sm,
      minWidth: buttonMinWidths[size],
      minHeight: element.size,
      borderRadius: Number(hightideRadius[size === 'xl' ? 'lg' : size === 'lg' ? 'md' : size]),
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: buttonFontSizes[size],
      fontWeight: hightideTypography.fontWeight.semibold,
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
