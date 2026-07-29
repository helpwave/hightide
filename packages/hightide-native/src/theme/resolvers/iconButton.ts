import type { ViewStyle } from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { ColorSchemes } from '@helpwave/hightide-design/theme'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from './colorScheme'
import type {
  IconButtonState,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateIconButtonThemeOptions = {
  colorSchemes: ColorSchemes,
  layout: ComponentTokens['iconButton']['layout'],
  borderWidth: number,
}

export const createIconButtonTheme = ({
  colorSchemes,
  layout,
  borderWidth,
}: CreateIconButtonThemeOptions): IconButtonTheme => {
  const resolveState = (state: IconButtonState) => {
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
    const dimension = element.size
    const resolvedBorderWidth = resolved.borderWidth > 0
      ? resolved.borderWidth
      : (isOutlineColoringStyle(coloringStyle) ? borderWidth : 0)

    const button: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolvedBorderWidth,
      width: dimension,
      height: dimension,
      borderRadius: element.radius,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    return {
      button,
      icon: { color: resolved.color },
    }
  }

  return {
    button: createStyleResolver((state) => resolveState(state).button),
    icon: createValueResolver((state) => resolveState(state).icon),
  }
}

export const createIconButtonThemeFromDesign = (theme: DesignTokensTheme): IconButtonTheme => {
  return createIconButtonTheme({
    colorSchemes: theme.semantic.colorSchemes,
    layout: theme.components.iconButton.layout,
    borderWidth: theme.semantic.border.base,
  })
}
