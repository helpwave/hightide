import {
  componentLayouts,
  toPx,
  type ColoringTokensDefinitions,
  type DesignTheme as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type { ChipState, ChipStyle, ChipTextStyle, ChipTheme } from '../types'
import { resolveColoringStyles } from './coloring'

export type CreateChipThemeOptions = {
  semantic: SemanticColors,
  coloring: ColoringTokensDefinitions,
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
    const layout = componentLayouts.chip[size]

    const chip: ChipStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: toPx(layout.paddingVertical),
      paddingHorizontal: toPx(layout.paddingHorizontal),
      gap: toPx(layout.gap),
      minHeight: toPx(layout.minHeight),
      borderRadius: toPx(layout.borderRadius),
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: ChipTextStyle = {
      color: resolved.color,
      fontSize: toPx(layout.fontSize),
      fontWeight: '600',
    }

    return { chip, text }
  }

  return {
    chip: (state) => resolveState(state).chip,
    text: (state) => resolveState(state).text,
  }
}

export const createChipThemeFromDesign = (theme: DesignTokensTheme): ChipTheme => {
  return createChipTheme({
    semantic: theme.semantic,
    coloring: theme.coloring,
  })
}
