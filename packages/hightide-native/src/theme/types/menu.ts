import type { ColorValue } from '@helpwave/hightide-design'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type MenuSectionStyle = StyleProp<ViewStyle>

export type MenuSectionTitleStyle = StyleProp<TextStyle>

export type MenuCardStyle = StyleProp<ViewStyle>

export type MenuItemStyle = StyleProp<ViewStyle>

export type MenuItemContentStyle = StyleProp<ViewStyle>

export type MenuItemLabelStyle = StyleProp<TextStyle>

export type MenuItemValueStyle = StyleProp<TextStyle>

export type MenuActionItemState = InteractionState & {
  isDanger?: boolean,
}

export type MenuActionItemStyle = StyleProp<ViewStyle>

export type MenuActionItemContentStyle = StyleProp<ViewStyle>

export type MenuActionItemLabelStyle = StyleProp<TextStyle>

export type MenuActionItemIconColor = {
  color: ColorValue,
}

export type MenuTheme = {
  section: StyleResolverFunction<Record<string, never>, MenuSectionStyle>,
  sectionTitle: StyleResolverFunction<Record<string, never>, MenuSectionTitleStyle>,
  card: StyleResolverFunction<Record<string, never>, MenuCardStyle>,
  item: StyleResolverFunction<Record<string, never>, MenuItemStyle>,
  itemContent: StyleResolverFunction<Record<string, never>, MenuItemContentStyle>,
  itemLabel: StyleResolverFunction<Record<string, never>, MenuItemLabelStyle>,
  itemValue: StyleResolverFunction<Record<string, never>, MenuItemValueStyle>,
  actionItem: StyleResolverFunction<MenuActionItemState, MenuActionItemStyle>,
  actionItemContent: StyleResolverFunction<Record<string, never>, MenuActionItemContentStyle>,
  actionItemLabel: StyleResolverFunction<MenuActionItemState, MenuActionItemLabelStyle>,
  actionItemIcon: StyleResolverFunction<MenuActionItemState, MenuActionItemIconColor>,
  navigationItem: StyleResolverFunction<MenuActionItemState, MenuActionItemStyle>,
  navigationItemContent: StyleResolverFunction<Record<string, never>, MenuActionItemContentStyle>,
  navigationItemLabel: StyleResolverFunction<MenuActionItemState, MenuActionItemLabelStyle>,
  navigationItemIcon: StyleResolverFunction<MenuActionItemState, MenuActionItemIconColor>,
  navigationItemTrailing: StyleResolverFunction<Record<string, never>, MenuActionItemIconColor>,
}
