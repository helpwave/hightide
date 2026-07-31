import type { TextStyle } from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import { resolveColoringStyles } from './colorScheme'
import type {
  IconButtonIconStyle,
  IconButtonState,
  IconButtonStyle,
  IconButtonTextStyle,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export const createIconButtonContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme
  const layout = theme.components.iconButton.layout

  return createStyleResolver((state: IconButtonState): IconButtonStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      colorSchemes,
      color,
      coloringStyle,
      state
    )
    const element = layout[size]
    const dimension = element.size

    return {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: element.borderWidth,
      width: dimension,
      height: dimension,
      borderRadius: element.borderRadius,
      overflow: 'hidden',
      opacity: state.isDisabled ? 0.6 : 1,
    }
  })
}

export const createIconButtonIconTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme

  return createValueResolver((state: IconButtonState): IconButtonIconStyle => {
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      colorSchemes,
      color,
      coloringStyle,
      state
    )

    return { color: resolved.color }
  })
}

export const createIconButtonTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme
  const layout = theme.components.iconButton.layout

  return createStyleResolver((state: IconButtonState): IconButtonTextStyle => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
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

export const createIconButtonTheme = (theme: HightideDesignSystemTokens): IconButtonTheme => ({
  button: createIconButtonContainerTheme(theme),
  icon: createIconButtonIconTheme(theme),
  text: createIconButtonTextTheme(theme),
})
