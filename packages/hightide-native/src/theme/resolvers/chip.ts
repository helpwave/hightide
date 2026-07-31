import type { TextStyle } from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  ChipState,
  ChipStyle,
  ChipTextStyle,
  ChipTheme
} from '../types/components/chip'
import { createStyleResolver } from '../types/resolver'

export const createChipContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, layout } = theme.components.chip

  return createStyleResolver((state: ChipState): ChipStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const colorState = colorSchemes[coloringStyle][color]
    const element = layout[size]

    return {
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
  })
}

export const createChipTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, layout } = theme.components.chip

  return createStyleResolver((state: ChipState): ChipTextStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const colorState = colorSchemes[coloringStyle][color]
    const { textStyle } = layout[size]

    return {
      color: colorState.foreground,
      fontSize: Number(textStyle.fontSize),
      fontWeight: textStyle.fontWeight as TextStyle['fontWeight'],
      fontFamily: textStyle.fontFamily,
      lineHeight: typeof textStyle.lineHeight === 'number'
        ? textStyle.lineHeight
        : Number(textStyle.lineHeight),
    }
  })
}

export const createChipTheme = (theme: HightideDesignSystemTokens): ChipTheme => ({
  chip: createChipContainerTheme(theme),
  text: createChipTextTheme(theme),
})
