import type { ViewStyle } from 'react-native'

import { componentLayouts } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideDesignTokens as DesignTokensTheme,
  ElementSize
} from '@helpwave/hightide-design/types'

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
  component: ComponentColorTokens,
}

export const createCheckboxTheme = ({
  semantic,
  component,
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
        : (isActive ? semantic.primary : component.border)

    const backgroundColor = state.isDisabled
      ? semantic.disabled
      : (isActive ? semantic.primary : component.input.background)

    const checkbox: ViewStyle = {
      width: dimension,
      height: dimension,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: componentLayouts.shared.coloringOutlineWidth,
      borderColor,
      borderRadius: state.isRounded ? dimension / 2 : 6,
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
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
