import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import {
  hightideElements,
  hightideRadius,
  hightideSpacing,
  hightideTypography
} from '@helpwave/hightide-design/primitive'
import type { HightideThemeTokens as DesignTokensTheme } from '@helpwave/hightide-design/theme'

import { resolveColoringStyles } from './coloring'
import type { HightideSemanticColors } from '../types/color'
import type {
  ChipState,
  ChipTheme
} from '../types/components/chip'
import type { HightideComponentThemes } from '../types/components/hightide'
import { createStyleResolver } from '../types/resolver'

export type CreateChipThemeOptions = {
  semantic: HightideSemanticColors,
  coloring: HightideComponentThemes['coloring'],
}

export const createChipTheme = ({
  semantic,
  coloring,
}: CreateChipThemeOptions): ChipTheme => {
  const resolveState = (state: ChipState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'solid'
    const tokens = coloring[color]
    const resolved = resolveColoringStyles(tokens, coloringStyle, semantic, state)
    const element = hightideElements[size]
    const gap = size === 'xs' || size === 'sm' ? hightideSpacing.xs : hightideSpacing.sm
    const horizontalInset = Math.max(Math.round(element.inset * 0.8), hightideSpacing.xs)
    const verticalInset = Math.max(Math.round(element.inset * 0.5), 3)

    const chip: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: verticalInset,
      paddingHorizontal: horizontalInset,
      gap,
      minHeight: Math.max(element.size - hightideSpacing.xs, 24),
      borderRadius: Number(hightideRadius[size === 'xl' ? 'md' : size === 'lg' ? 'md' : size]),
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: Number(hightideTypography.fontSize.sm),
      fontWeight: hightideTypography.fontWeight.semibold,
    }

    return { chip, text }
  }

  return {
    chip: createStyleResolver((state) => resolveState(state).chip),
    text: createStyleResolver((state) => resolveState(state).text),
  }
}

export const createChipThemeFromDesign = (theme: DesignTokensTheme): ChipTheme => {
  return createChipTheme({
    semantic: theme.semanticColors,
    coloring: theme.coloring as HightideComponentThemes['coloring'],
  })
}
