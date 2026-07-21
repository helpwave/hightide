import { remToPx } from '@helpwave/hightide-design/helpers'
import { spacing } from '@helpwave/hightide-design/tokens'
import {
  type ComponentColors,
  type DesignTokens as DesignTokensTheme,
  type ElementSize,
  type SemanticColors
} from '@helpwave/hightide-design/types'
import type { ViewStyle } from 'react-native'
import type {
  CheckboxSize,
  CheckboxState,
  CheckboxTheme
} from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

const checkboxSizes: Record<CheckboxSize, number> = {
  sm: remToPx('1.25rem'),
  md: remToPx('1.5rem'),
  lg: remToPx('2rem'),
}

const checkboxIconSizes: Record<CheckboxSize, Exclude<ElementSize, 'xs'>> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export type CreateCheckboxThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
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
      borderWidth: remToPx(spacing.coloringOutlineWidth),
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
    semantic: theme.semantic,
    component: theme.component,
  })
}
