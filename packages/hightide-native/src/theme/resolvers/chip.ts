import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import { toPx } from '@helpwave/hightide-design/helpers'
import {
  componentLayouts,
  fontWeights
} from '@helpwave/hightide-design/tokens'
import type { HightideDesignTokens as DesignTokensTheme } from '@helpwave/hightide-design/types'

import { resolveColoringStyles } from '@/src/theme/resolvers/coloring'
import type { HightideSemanticColors } from '@/src/theme/types/color'
import type {
  ChipState,
  ChipTheme
} from '@/src/theme/types/components/chip'
import type { HightideComponentThemes } from '@/src/theme/types/components/hightide'
import { createStyleResolver } from '@/src/theme/types/resolver'

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
    const layout = componentLayouts.chip[size]

    const chip: ViewStyle = {
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

    const text: TextStyle = {
      color: resolved.color,
      fontSize: toPx(layout.fontSize),
      fontWeight: fontWeights.semibold,
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
