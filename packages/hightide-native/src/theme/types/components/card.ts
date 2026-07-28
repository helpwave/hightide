import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type CardStyle = ViewStyle

export type CardItemStyle = ViewStyle

export type CardItemContentStyle = ViewStyle

export type CardItemLabelStyle = TextStyle

export type CardItemValueStyle = TextStyle

export type CardActionItemState = InteractionState & {
  isDanger?: boolean,
}

export type CardActionItemStyle = ViewStyle

export type CardActionItemContentStyle = ViewStyle

export type CardActionItemLabelStyle = TextStyle

export type CardActionItemIconColor = {
  color: Color,
}

export type CardTheme = {
  card: StyleResolverFunction<Record<string, never>, CardStyle>,
  item: StyleResolverFunction<Record<string, never>, CardItemStyle>,
  itemContent: StyleResolverFunction<Record<string, never>, CardItemContentStyle>,
  itemLabel: StyleResolverFunction<Record<string, never>, CardItemLabelStyle>,
  itemValue: StyleResolverFunction<Record<string, never>, CardItemValueStyle>,
  actionItem: StyleResolverFunction<CardActionItemState, CardActionItemStyle>,
  actionItemContent: StyleResolverFunction<Record<string, never>, CardActionItemContentStyle>,
  actionItemLabel: StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle>,
  actionItemIcon: StyleResolverFunction<CardActionItemState, CardActionItemIconColor>,
  navigationItem: StyleResolverFunction<CardActionItemState, CardActionItemStyle>,
  navigationItemContent: StyleResolverFunction<Record<string, never>, CardActionItemContentStyle>,
  navigationItemLabel: StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle>,
  navigationItemIcon: StyleResolverFunction<CardActionItemState, CardActionItemIconColor>,
  navigationItemTrailing: StyleResolverFunction<Record<string, never>, CardActionItemIconColor>,
}
