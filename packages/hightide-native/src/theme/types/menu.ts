import type { ColorValue, FontWeight } from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type MenuSectionStyle = {
  marginBottom: number,
  gap: number,
}

export type MenuSectionTitleStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
  letterSpacing: number,
  textTransform: 'uppercase',
  paddingHorizontal: number,
}

export type MenuCardStyle = {
  backgroundColor: ColorValue,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorValue,
  overflow: 'hidden',
}

export type MenuItemStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderBottomWidth: number,
  borderBottomColor: ColorValue,
  gap: number,
}

export type MenuItemContentStyle = {
  flex: number,
  gap: number,
  justifyContent: 'center',
}

export type MenuItemLabelStyle = {
  color: ColorValue,
  fontSize: number,
}

export type MenuItemValueStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type MenuActionItemState = InteractionState & {
  isDanger?: boolean,
}

export type MenuActionItemStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: number,
  gap: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderBottomWidth: number,
  borderBottomColor: ColorValue,
  backgroundColor: ColorValue | 'transparent',
  opacity: number,
}

export type MenuActionItemContentStyle = {
  flex: number,
  gap: number,
  justifyContent: 'center',
}

export type MenuActionItemLabelStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type MenuActionItemIconColor = {
  color: ColorValue,
}

export type MenuTheme = {
  section: ResolverFunction<Record<string, never>, MenuSectionStyle>,
  sectionTitle: ResolverFunction<Record<string, never>, MenuSectionTitleStyle>,
  card: ResolverFunction<Record<string, never>, MenuCardStyle>,
  item: ResolverFunction<Record<string, never>, MenuItemStyle>,
  itemContent: ResolverFunction<Record<string, never>, MenuItemContentStyle>,
  itemLabel: ResolverFunction<Record<string, never>, MenuItemLabelStyle>,
  itemValue: ResolverFunction<Record<string, never>, MenuItemValueStyle>,
  actionItem: ResolverFunction<MenuActionItemState, MenuActionItemStyle>,
  actionItemContent: ResolverFunction<Record<string, never>, MenuActionItemContentStyle>,
  actionItemLabel: ResolverFunction<MenuActionItemState, MenuActionItemLabelStyle>,
  actionItemIcon: ResolverFunction<MenuActionItemState, MenuActionItemIconColor>,
  navigationItem: ResolverFunction<MenuActionItemState, MenuActionItemStyle>,
  navigationItemContent: ResolverFunction<Record<string, never>, MenuActionItemContentStyle>,
  navigationItemLabel: ResolverFunction<MenuActionItemState, MenuActionItemLabelStyle>,
  navigationItemIcon: ResolverFunction<MenuActionItemState, MenuActionItemIconColor>,
  navigationItemTrailing: ResolverFunction<Record<string, never>, MenuActionItemIconColor>,
}
