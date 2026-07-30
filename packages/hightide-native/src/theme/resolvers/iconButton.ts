import type { ViewStyle } from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes } from '@helpwave/hightide-design/semantic-tokens'

import { resolveColoringStyles } from './colorScheme'
import type {
  IconButtonState,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateIconButtonThemeOptions = {
  colorSchemes: HightideColorSchemes,
  layout: HightideComponentTokens['iconButton']['layout'],
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

    const button: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
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
    borderWidth: theme.semantic.border.normal,
  })
}
