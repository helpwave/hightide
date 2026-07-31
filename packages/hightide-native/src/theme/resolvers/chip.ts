import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import { isOutlineColoringStyle } from './colorScheme'
import type {
  ChipState,
  ChipTheme
} from '../types/components/chip'
import { createStyleResolver } from '../types/resolver'

export type CreateChipThemeOptions = {
  colorSchemes: HightideComponentTokens['chip']['colorSchemes'],
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
    const colorState = colorSchemes[coloringStyle][color]
    const element = layout[size]
    const outlinePadding = isOutlineColoringStyle(coloringStyle)
    const outlineInset = Math.max(element.inset - borderWidth, 0)

    const chip: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colorState.color,
      borderColor: colorState.border,
      borderWidth,
      paddingVertical: outlinePadding ? outlineInset : element.inset,
      paddingHorizontal: outlinePadding
        ? Math.max(element.horizontalInset - borderWidth, 0)
        : element.horizontalInset,
      gap: element.gap,
      minHeight: element.size,
      borderRadius: element.radius,
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
    borderWidth: theme.borderWidth.normal,
  })
}
