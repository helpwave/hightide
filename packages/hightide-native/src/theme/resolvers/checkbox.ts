import type { ViewStyle } from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic-tokens'

import type {
  CheckboxState,
  CheckboxTheme
} from '../types/components/checkbox'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateCheckboxThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  checkbox: HightideComponentTokens['checkbox'],
}

export const createCheckboxTheme = ({
  colors,
  colorSchemes,
  checkbox: checkboxTokens,
}: CreateCheckboxThemeOptions): CheckboxTheme => {
  const resolveState = (state: CheckboxState) => {
    const size = state.size ?? 'md'
    const box = checkboxTokens.box.layout[size]
    const icon = checkboxTokens.icon.layout[size]
    const dimension = box.size
    const isActive = !!(state.isChecked || state.isIndeterminate)
    const showIndicator = !!(state.isIndeterminate || state.alwaysShowCheckIcon || state.isChecked)
    const primary = colorSchemes.primary.filled.base
    const negative = colorSchemes.negative.text.base.foreground

    const borderColor = state.isDisabled
      ? colors.disabled
      : state.isInvalid
        ? negative
        : (isActive ? primary.background : colors.border)

    const backgroundColor = state.isDisabled
      ? colors.disabled
      : (isActive ? primary.background : checkboxTokens.background)

    const checkbox: ViewStyle = {
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

    return {
      checkbox,
      icon: {
        color: isActive ? primary.foreground : colorSchemes.primary.text.base.foreground,
        size: icon.size,
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
    colors: theme.colors,
    colorSchemes: theme.colorSchemes,
    checkbox: theme.components.checkbox,
  })
}
