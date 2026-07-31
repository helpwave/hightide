import type { TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  CardActionItemContentStyle,
  CardActionItemIconColor,
  CardActionItemLabelStyle,
  CardActionItemState,
  CardActionItemStyle,
  CardItemContentStyle,
  CardItemLabelStyle,
  CardItemStyle,
  CardItemValueStyle,
  CardStyle,
  CardTheme
} from '../types/components/card'
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

export const createCardContainerTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardStyle> => {
  const card = theme.components.card

  return createSimpleStyleResolver<CardStyle>(() => ({
    backgroundColor: card.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: card.border,
    overflow: 'hidden',
  }))
}

export const createCardItemTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardItemStyle> => {
  const { colors } = theme

  return createSimpleStyleResolver<CardItemStyle>(() => ({
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    gap: 12,
  }))
}

export const createCardItemContentTheme = (
  _theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardItemContentStyle> => {
  return createSimpleStyleResolver<CardItemContentStyle>(() => ({
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  }))
}

export const createCardItemLabelTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardItemLabelStyle> => {
  return createSimpleStyleResolver<CardItemLabelStyle>(() => ({
    color: theme.colors.description,
    fontSize: 12,
  }))
}

export const createCardItemValueTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardItemValueStyle> => {
  const card = theme.components.card

  return createSimpleStyleResolver<CardItemValueStyle>(() => ({
    color: card.text,
    fontSize: 15,
    fontWeight: hightideTypography.fontWeight.medium as TextStyle['fontWeight'],
  }))
}

export const createCardActionItemTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemStyle> => {
  const { colors } = theme

  return createStyleResolver<CardActionItemState, CardActionItemStyle>((state) => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 64,
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      backgroundColor: pressed ? colors.surfaceHover : colors.transparent,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  })
}

export const createCardActionItemContentTheme = (
  _theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardActionItemContentStyle> => {
  return createSimpleStyleResolver<CardActionItemContentStyle>(() => ({
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  }))
}

export const createCardActionItemLabelTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle> => {
  const { colorSchemes, components } = theme
  const card = components.card

  return createStyleResolver<CardActionItemState, CardActionItemLabelStyle>((state) => ({
    color: state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : card.text,
    fontSize: 15,
    fontWeight: hightideTypography.fontWeight.medium as TextStyle['fontWeight'],
  }))
}

export const createCardActionItemIconTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemIconColor> => {
  const { colorSchemes } = theme

  return createValueResolver<CardActionItemState, CardActionItemIconColor>((state) => ({
    color: state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : colorSchemes.primary.text.base.foreground,
  }))
}

export const createCardNavigationItemTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemStyle> => {
  return createCardActionItemTheme(theme)
}

export const createCardNavigationItemContentTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardActionItemContentStyle> => {
  return createCardActionItemContentTheme(theme)
}

export const createCardNavigationItemLabelTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle> => {
  return createCardActionItemLabelTheme(theme)
}

export const createCardNavigationItemIconTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<CardActionItemState, CardActionItemIconColor> => {
  return createCardActionItemIconTheme(theme)
}

export const createCardNavigationItemTrailingTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<CardActionItemIconColor> => {
  return createSimpleValueResolver(() => ({
    color: theme.colors.description,
  }))
}

export const createCardTheme = (theme: HightideDesignSystemTokens): CardTheme => ({
  card: createCardContainerTheme(theme),
  item: createCardItemTheme(theme),
  itemContent: createCardItemContentTheme(theme),
  itemLabel: createCardItemLabelTheme(theme),
  itemValue: createCardItemValueTheme(theme),
  actionItem: createCardActionItemTheme(theme),
  actionItemContent: createCardActionItemContentTheme(theme),
  actionItemLabel: createCardActionItemLabelTheme(theme),
  actionItemIcon: createCardActionItemIconTheme(theme),
  navigationItem: createCardNavigationItemTheme(theme),
  navigationItemContent: createCardNavigationItemContentTheme(theme),
  navigationItemLabel: createCardNavigationItemLabelTheme(theme),
  navigationItemIcon: createCardNavigationItemIconTheme(theme),
  navigationItemTrailing: createCardNavigationItemTrailingTheme(theme),
})
