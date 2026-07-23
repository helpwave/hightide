import type { ViewStyle } from 'react-native'

import { componentLayouts } from '@helpwave/hightide-design/tokens'
import type { HightideThemeTokens as DesignTokensTheme } from '@helpwave/hightide-design/types'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from './coloring'
import type { HightideSemanticColors } from '../types/color'
import type { HightideComponentThemes } from '../types/components/hightide'
import type {
  IconButtonState,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateIconButtonThemeOptions = {
  semantic: HightideSemanticColors,
  coloring: HightideComponentThemes['coloring'],
}

export const createIconButtonTheme = ({
  semantic,
  coloring,
}: CreateIconButtonThemeOptions): IconButtonTheme => {
  const resolveState = (state: IconButtonState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'neutral'
    const coloringStyle = state.coloringStyle ?? 'solid'
    const tokens = coloring[color]
    const resolved = resolveColoringStyles(tokens, coloringStyle, semantic, state)
    const sizing = componentLayouts.element[size]
    const outlineWidth = componentLayouts.shared.coloringOutlineWidth
    const dimension = sizing.height
    const borderWidth = resolved.borderWidth > 0
      ? resolved.borderWidth
      : (isOutlineColoringStyle(coloringStyle) ? outlineWidth : 0)

    const button: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth,
      width: dimension,
      height: dimension,
      borderRadius: componentLayouts.button[size].borderRadius,
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
    semantic: theme.semanticColors,
    coloring: theme.coloring as HightideComponentThemes['coloring'],
  })
}
