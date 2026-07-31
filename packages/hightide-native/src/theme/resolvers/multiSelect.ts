import type {
  TextStyle
} from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  MultiSelectCheckboxIconStyle,
  MultiSelectCheckboxStyle,
  MultiSelectOptionState,
  MultiSelectOptionStyle,
  MultiSelectOptionTextStyle,
  MultiSelectState,
  MultiSelectTheme,
  MultiSelectTriggerStyle
} from '../types/components/multiSelect'
import type {
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import type { Color } from '../types/color'
import type {
  SimpleStyleResolver,
  StyleResolverFunction
} from '../types/resolver'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export const createMultiSelectTriggerTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<MultiSelectState, MultiSelectTriggerStyle> => {
  const { colors, colorSchemes, components } = theme
  const input = components.input

  return createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => ({
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: state.isInvalid
      ? colorSchemes.negative.text.base.foreground
      : colors.border,
    backgroundColor: state.isDisabled ? colors.disabled : input.background,
    justifyContent: 'center',
    gap: 8,
    opacity: state.isDisabled ? 0.6 : 1,
  }))
}

export const createMultiSelectTriggerTextTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<SelectTriggerTextStyle> => {
  return createSimpleStyleResolver((): SelectTriggerTextStyle => ({
    color: theme.colors.placeholder,
  }))
}

export const createMultiSelectOverlayTheme = (
  _theme: HightideDesignSystemTokens
): SimpleStyleResolver<SelectOverlayStyle> => {
  return createSimpleStyleResolver((): SelectOverlayStyle => ({
    flex: 1,
    backgroundColor: '#00000059',
    justifyContent: 'center',
    padding: 24,
  }))
}

export const createMultiSelectMenuTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<SelectMenuStyle> => {
  const card = theme.components.card

  return createSimpleStyleResolver((): SelectMenuStyle => ({
    maxHeight: 360,
    borderRadius: 12,
    backgroundColor: card.background,
    borderWidth: 1,
    borderColor: card.border,
    overflow: 'hidden',
  }))
}

export const createMultiSelectSearchTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<SelectSearchStyle> => {
  const card = theme.components.card

  return createSimpleStyleResolver((): SelectSearchStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: card.border,
    color: card.text,
  }))
}

export const createMultiSelectSearchPlaceholderColorTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<Color> => {
  return createSimpleValueResolver((): Color => theme.colors.placeholder)
}

export const createMultiSelectOptionTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionStyle> => {
  const { colors } = theme

  return createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: state.isHighlighted ? colors.surfaceHover : colors.transparent,
    opacity: state.isDisabled ? 0.5 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }))
}

export const createMultiSelectOptionTextTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionTextStyle> => {
  const { colorSchemes, components } = theme
  const card = components.card

  return createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => ({
    color: state.isSelected ? colorSchemes.primary.text.base.foreground : card.text,
    fontWeight: (state.isSelected
      ? hightideTypography.fontWeight.semibold
      : hightideTypography.fontWeight.base) as TextStyle['fontWeight'],
  }))
}

export const createMultiSelectCheckboxTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxStyle> => {
  const { colors, colorSchemes } = theme
  const primary = colorSchemes.primary.filled.base

  return createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => ({
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: state.isSelected ? primary.color : colors.border,
    backgroundColor: state.isSelected ? primary.color : colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  }))
}

export const createMultiSelectCheckboxIconTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxIconStyle> => {
  const primary = theme.colorSchemes.primary.filled.base

  return createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => ({
    color: primary.foreground,
    visible: !!state.isSelected,
  }))
}

export const createMultiSelectTheme = (theme: HightideDesignSystemTokens): MultiSelectTheme => ({
  trigger: createMultiSelectTriggerTheme(theme),
  triggerText: createMultiSelectTriggerTextTheme(theme),
  overlay: createMultiSelectOverlayTheme(theme),
  menu: createMultiSelectMenuTheme(theme),
  search: createMultiSelectSearchTheme(theme),
  searchPlaceholderColor: createMultiSelectSearchPlaceholderColorTheme(theme),
  option: createMultiSelectOptionTheme(theme),
  optionText: createMultiSelectOptionTextTheme(theme),
  checkbox: createMultiSelectCheckboxTheme(theme),
  checkboxIcon: createMultiSelectCheckboxIconTheme(theme),
})
