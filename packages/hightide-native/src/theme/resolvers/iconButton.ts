import type { ViewStyle } from 'react-native'

import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import { resolveColoringStyles } from './colorScheme'
import type {
  IconButtonState,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export const createIconButtonThemeFromDesign = (theme: DesignTokensTheme): IconButtonTheme => {
  const { colorSchemes, components } = theme
  const layout = components.iconButton.layout

  const resolveState = (state: IconButtonState) => {
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

    const button: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: element.borderWidth,
      width: dimension,
      height: dimension,
      borderRadius: element.borderRadius,
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
