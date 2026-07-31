import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type {
  ChipState,
  ChipTheme
} from '../types/components/chip'
import { createStyleResolver } from '../types/resolver'

export type CreateChipThemeOptions = {
  colorSchemes: HightideComponentTokens['chip']['colorSchemes'],
  layout: HightideComponentTokens['chip']['layout'],
  fontWeight: number,
}

export const createChipTheme = ({
  colorSchemes,
  layout,
  fontWeight,
}: CreateChipThemeOptions): ChipTheme => {
  const resolveState = (state: ChipState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const colorState = colorSchemes[coloringStyle][color]
    const element = layout[size]

    const chip: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorState.color,
      borderColor: colorState.border,
      borderWidth: element.borderWidth,
      paddingVertical: element.inset,
      paddingHorizontal: element.horizontalInset,
      gap: element.gap,
      minHeight: element.size,
      borderRadius: element.borderRadius,
    }

    const text: TextStyle = {
      color: colorState.foreground,
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
    colorSchemes: theme.components.chip.colorSchemes,
    layout: theme.components.chip.layout,
    fontWeight: theme.typography.fontWeights.semibold,
  })
}
