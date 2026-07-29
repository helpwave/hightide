import type { ViewStyle } from 'react-native'

import { hightideRadius } from '@helpwave/hightide-design/primitive'
import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type {
  ComponentSize,
  ColorSchemes
} from '@helpwave/hightide-design/theme'

import type { HightideSemanticColors } from '../types/color'
import type {
  CheckboxSize,
  CheckboxState,
  CheckboxTheme
} from '../types/components/checkbox'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const checkboxIconComponentSize: Record<CheckboxSize, ComponentSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export type CreateCheckboxThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: ColorSchemes,
  input: ComponentTokens['input'],
  layout: ComponentTokens['checkbox']['layout'],
}

export const createCheckboxTheme = ({
  semantic,
  colorSchemes,
  input,
  layout,
}: CreateCheckboxThemeOptions): CheckboxTheme => {
  const resolveState = (state: CheckboxState) => {
    const size = state.size ?? 'md'
    const element = layout[size]
    const dimension = element.size
    const isActive = !!(state.isChecked || state.isIndeterminate)
    const showIndicator = !!(state.isIndeterminate || state.alwaysShowCheckIcon || state.isChecked)
    const primary = colorSchemes.primary.filled.base
    const negative = colorSchemes.negative.text.base.foreground

    const borderColor = state.isDisabled
      ? semantic.disabled
      : state.isInvalid
        ? negative
        : (isActive ? primary.background : semantic.border)

    const backgroundColor = state.isDisabled
      ? semantic.disabled
      : (isActive ? primary.background : input.background)

    const checkbox: ViewStyle = {
      width: dimension,
      height: dimension,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: element.border,
      borderColor,
      borderRadius: state.isRounded ? dimension / 2 : Number(hightideRadius.sm),
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    return {
      checkbox,
      icon: {
        color: isActive ? primary.foreground : colorSchemes.primary.text.base.foreground,
        size: checkboxIconComponentSize[size],
        visible: showIndicator,
      },
    }
  }

  return {
    checkbox: createStyleResolver((state) => resolveState(state).checkbox),
    icon: createValueResolver((state) => resolveState(state).icon),
  }
}

export const createCheckboxThemeFromDesign = (theme: DesignTokensTheme): CheckboxTheme => {
  return createCheckboxTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    input: theme.components.input,
    layout: theme.components.checkbox.layout,
  })
}
