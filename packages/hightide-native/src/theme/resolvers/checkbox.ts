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
  input: ComponentTokens['input'],
}

export const createCheckboxTheme = ({
  semantic,
  input,
}: CreateCheckboxThemeOptions): CheckboxTheme => {
  const resolveState = (state: CheckboxState) => {
    const size = state.size ?? 'md'
    const dimension = checkboxSizes[size]
    const isActive = !!(state.isChecked || state.isIndeterminate)
    const showIndicator = !!(state.isIndeterminate || state.alwaysShowCheckIcon || state.isChecked)

    const borderColor = state.isDisabled
      ? semantic.disabled
      : state.isInvalid
        ? semantic.negative
        : (isActive ? semantic.primary : semantic.border)

    const backgroundColor = state.isDisabled
      ? semantic.disabled
      : (isActive ? semantic.primary : input.background)

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
        color: isActive ? semantic.onPrimary : semantic.primary,
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
    input: theme.components.input,
  })
}
