import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes } from '@helpwave/hightide-design/semantic-tokens'

import { resolveColoringStyles } from './colorScheme'
import type {
  ChipState,
  ChipTheme
} from '../types/components/chip'
import { createStyleResolver } from '../types/resolver'

export type CreateChipThemeOptions = {
  colorSchemes: HightideColorSchemes,
  layout: HightideComponentTokens['chip']['layout'],
  fontWeight: number,
  borderWidth: number,
}

export const createChipTheme = ({
  colorSchemes,
  layout,
  fontWeight,
  borderWidth,
}: CreateChipThemeOptions): ChipTheme => {
  const resolveState = (state: ChipState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      colorSchemes,
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
    colorSchemes: theme.semantic.colorSchemes,
    layout: theme.components.chip.layout,
    fontWeight: theme.semantic.typography.fontWeights.semibold,
    borderWidth: theme.semantic.border.normal,
  })
}
