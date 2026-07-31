import type { TextStyle } from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTheme,
  SelectTriggerStyle,
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
  createStyleResolver
} from '../types/resolver'

export const createSelectTriggerTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<SelectState, SelectTriggerStyle> => {
  const { colors, colorSchemes, components } = theme
  const input = components.input

  return createStyleResolver((state: SelectState): SelectTriggerStyle => ({
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
    opacity: state.isDisabled ? 0.6 : 1,
  }))
}

export const createSelectTriggerTextTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<SelectState, SelectTriggerTextStyle> => {
  const { colors, components } = theme
  const input = components.input

  return createStyleResolver((state: SelectState): SelectTriggerTextStyle => ({
    color: state.hasValue ? input.text : colors.placeholder,
  }))
}

export const createSelectOverlayTheme = (
  _theme: HightideDesignSystemTokens
): SimpleStyleResolver<SelectOverlayStyle> => {
  return createSimpleStyleResolver((): SelectOverlayStyle => ({
    flex: 1,
    backgroundColor: '#00000059',
    justifyContent: 'center',
    padding: 24,
  }))
}

export const createSelectMenuTheme = (
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

export const createSelectSearchTheme = (
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

export const createSelectSearchPlaceholderColorTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<Color> => {
  return createSimpleValueResolver((): Color => theme.colors.placeholder)
}

export const createSelectOptionTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<SelectOptionState, SelectOptionStyle> => {
  const { colors } = theme

  return createStyleResolver((state: SelectOptionState): SelectOptionStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: state.isHighlighted ? colors.surfaceHover : colors.transparent,
    opacity: state.isDisabled ? 0.5 : 1,
  }))
}

export const createSelectOptionTextTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<SelectOptionState, SelectOptionTextStyle> => {
  const { colorSchemes, components } = theme
  const card = components.card

  return createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => ({
    color: state.isSelected ? colorSchemes.primary.text.base.foreground : card.text,
    fontWeight: (state.isSelected
      ? hightideTypography.fontWeight.semibold
      : hightideTypography.fontWeight.base) as TextStyle['fontWeight'],
  }))
}

export const createSelectTheme = (theme: HightideDesignSystemTokens): SelectTheme => ({
  trigger: createSelectTriggerTheme(theme),
  triggerText: createSelectTriggerTextTheme(theme),
  overlay: createSelectOverlayTheme(theme),
  menu: createSelectMenuTheme(theme),
  search: createSelectSearchTheme(theme),
  searchPlaceholderColor: createSelectSearchPlaceholderColorTheme(theme),
  option: createSelectOptionTheme(theme),
  optionText: createSelectOptionTextTheme(theme),
})
