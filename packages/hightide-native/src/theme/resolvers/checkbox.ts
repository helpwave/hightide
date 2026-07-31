import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  CheckboxIconStyle,
  CheckboxState,
  CheckboxStyle,
  CheckboxTheme
} from '../types/components/checkbox'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export const createCheckboxContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, colorSchemes, components } = theme
  const checkboxTokens = components.checkbox

  return createStyleResolver((state: CheckboxState): CheckboxStyle => {
    const size = state.size ?? 'md'
    const box = checkboxTokens.box.layout[size]
    const dimension = box.size
    const isActive = !!(state.isChecked || state.isIndeterminate)
    const primary = colorSchemes.primary.filled.base
    const negative = colorSchemes.negative.text.base.foreground

    const borderColor = state.isDisabled
      ? colors.disabled
      : state.isInvalid
        ? negative
        : (isActive ? primary.color : colors.border)

    const backgroundColor = state.isDisabled
      ? colors.disabled
      : (isActive ? primary.color : checkboxTokens.background)

    return {
      width: dimension,
      height: dimension,
      alignItems: 'center',
      justifyContent: 'center',
      padding: box.inset,
      borderWidth: box.borderWidth,
      borderColor,
      borderRadius: state.isRounded ? dimension / 2 : box.borderRadius,
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  })
}

export const createCheckboxIconTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, components } = theme
  const checkboxTokens = components.checkbox

  return createValueResolver((state: CheckboxState): CheckboxIconStyle => {
    const size = state.size ?? 'md'
    const icon = checkboxTokens.icon.layout[size]
    const isActive = !!(state.isChecked || state.isIndeterminate)
    const showIndicator = !!(state.isIndeterminate || state.alwaysShowCheckIcon || state.isChecked)
    const primary = colorSchemes.primary.filled.base

    return {
      color: isActive ? primary.foreground : colorSchemes.primary.text.base.foreground,
      size: icon.size,
      visible: showIndicator,
    }
  })
}

export const createCheckboxTheme = (theme: HightideDesignSystemTokens): CheckboxTheme => ({
  checkbox: createCheckboxContainerTheme(theme),
  icon: createCheckboxIconTheme(theme),
})
