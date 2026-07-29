import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import { resolveColoringStyles } from './coloring'
import type {
  ChipState,
  ChipTheme
} from '../types/components/chip'
import type { HightideComponentThemes } from '../types/components/hightide'
import { createStyleResolver } from '../types/resolver'

export type CreateChipThemeOptions = {
  coloring: HightideComponentThemes['coloring'],
  layout: ComponentTokens['chip']['layout'],
  fontWeight: number,
  borderWidth: number,
}

export const createChipTheme = ({
  coloring,
  layout,
  fontWeight,
  borderWidth,
}: CreateChipThemeOptions): ChipTheme => {
  const resolveState = (state: ChipState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      coloring,
      color,
      coloringStyle,
      borderWidth,
      state
    )
    const element = layout[size]

    const chip: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: element.inset,
      paddingHorizontal: element.horizontalInset,
      gap: element.gap,
      minHeight: element.size,
      borderRadius: element.radius,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: element.fontSize,
      fontWeight: fontWeight as TextStyle['fontWeight'],
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
    coloring: theme.semantic.coloring,
    layout: theme.components.chip.layout,
    fontWeight: theme.semantic.typography.fontWeights.semibold,
    borderWidth: theme.semantic.border.base,
  })
}
