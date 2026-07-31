import type { TextStyle } from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from './colorScheme'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle,
  ButtonTheme
} from '../types/components/button'
import { createStyleResolver } from '../types/resolver'

export const createButtonContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, layout } = theme.components.button

  return createStyleResolver((state: ButtonState): ButtonStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'primary'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      colorSchemes,
      color,
      coloringStyle,
      state
    )
    const element = layout[size]
    const outlinePadding = isOutlineColoringStyle(coloringStyle)
    const outlineInset = Math.max(element.inset - element.borderWidth, 0)

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: element.borderWidth,
      paddingVertical: outlinePadding ? outlineInset : element.inset,
      paddingHorizontal: outlinePadding
        ? Math.max(element.horizontalInset - element.borderWidth, 0)
        : element.horizontalInset,
      gap: element.gap,
      minWidth: element.minWidth,
      minHeight: element.size,
      borderRadius: element.borderRadius,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  })
}

export const createButtonTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, layout } = theme.components.button

  return createStyleResolver((state: ButtonState): ButtonTextStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'primary'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      colorSchemes,
      color,
      coloringStyle,
      state
    )
    const { textStyle } = layout[size]

    return {
      color: resolved.color,
      fontSize: Number(textStyle.fontSize),
      fontWeight: textStyle.fontWeight as TextStyle['fontWeight'],
      fontFamily: textStyle.fontFamily,
      lineHeight: typeof textStyle.lineHeight === 'number'
        ? textStyle.lineHeight
        : Number(textStyle.lineHeight),
    }
  })
}

export const createButtonTheme = (theme: HightideDesignSystemTokens): ButtonTheme => ({
  button: createButtonContainerTheme(theme),
  text: createButtonTextTheme(theme),
})
