import type { ViewStyle } from 'react-native'

import {
  hightideBorder,
  hightideRadius,
  type ElementSize
} from '@helpwave/hightide-design/primitive'
import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type {
  CheckboxSize,
  CheckboxState,
  CheckboxTheme
} from '../types/components/checkbox'
import type { HightideComponentThemes } from '../types/components/hightide'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const checkboxSizes: Record<CheckboxSize, number> = {
  sm: 20,
  md: 24,
  lg: 32,
}

const checkboxIconSizes: Record<CheckboxSize, Exclude<ElementSize, 'xs'>> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export type CreateCheckboxThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: HightideComponentThemes['colorSchemes'],
  input: ComponentTokens['input'],
}

export const createCheckboxTheme = ({
  semantic,
  colorSchemes,
  input,
}: CreateCheckboxThemeOptions): CheckboxTheme => {
  const resolveState = (state: CheckboxState) => {
    const size = state.size ?? 'md'
    const dimension = checkboxSizes[size]
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
      borderWidth: hightideBorder.base,
      borderColor,
      borderRadius: state.isRounded ? dimension / 2 : Number(hightideRadius.sm),
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    return {
      checkbox,
      icon: {
        color: isActive ? primary.foreground : colorSchemes.primary.text.base.foreground,
        size: checkboxIconSizes[size],
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
  })
}
