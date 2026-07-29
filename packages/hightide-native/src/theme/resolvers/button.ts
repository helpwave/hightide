import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import {
  isOutlineColoringStyle,
  resolveColoringStyles
} from './coloring'
import type {
  ButtonState,
  ButtonTheme
} from '../types/components/button'
import type { HightideComponentThemes } from '../types/components/hightide'
import { createStyleResolver } from '../types/resolver'

export type CreateButtonThemeOptions = {
  coloring: HightideComponentThemes['coloring'],
  layout: ComponentTokens['button']['layout'],
  fontWeight: number,
  borderWidth: number,
}

export const createButtonTheme = ({
  coloring,
  layout,
  fontWeight,
  borderWidth,
}: CreateButtonThemeOptions): ButtonTheme => {
  const resolveState = (state: ButtonState) => {
    const size = state.size ?? 'md'
    const color = state.color ?? 'primary'
    const coloringStyle = state.coloringStyle ?? 'filled'
    const resolved = resolveColoringStyles(
      coloring,
      color,
      coloringStyle,
      borderWidth,
      state
    )
    const element = layout[size]
    const outlinePadding = isOutlineColoringStyle(coloringStyle)
    const outlineInset = Math.max(element.inset - borderWidth, 0)

    const button: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.backgroundColor,
      borderColor: resolved.borderColor,
      borderWidth: resolved.borderWidth,
      paddingVertical: outlinePadding ? outlineInset : element.inset,
      paddingHorizontal: outlinePadding
        ? Math.max(element.horizontalInset - borderWidth, 0)
        : element.horizontalInset,
      gap: element.gap,
      minWidth: element.minWidth,
      minHeight: element.size,
      borderRadius: element.radius,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: element.fontSize,
      fontWeight: fontWeight as TextStyle['fontWeight'],
    }

    return { button, text }
  }

  return {
    button: createStyleResolver((state) => resolveState(state).button),
    text: createStyleResolver((state) => resolveState(state).text),
  }
}

export const createButtonThemeFromDesign = (theme: DesignTokensTheme): ButtonTheme => {
  return createButtonTheme({
    coloring: theme.semantic.coloring,
    layout: theme.components.button.layout,
    fontWeight: theme.semantic.typography.fontWeights.semibold,
    borderWidth: theme.semantic.border.base,
  })
}
