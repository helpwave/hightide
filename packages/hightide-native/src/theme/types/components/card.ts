import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '../color'
import type {
  InteractionState,
  SimpleStyleResolver,
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
  card: SimpleStyleResolver<CardStyle>,
  item: SimpleStyleResolver<CardItemStyle>,
  itemContent: SimpleStyleResolver<CardItemContentStyle>,
  itemLabel: SimpleStyleResolver<CardItemLabelStyle>,
  itemValue: SimpleStyleResolver<CardItemValueStyle>,
  actionItem: StyleResolverFunction<CardActionItemState, CardActionItemStyle>,
  actionItemContent: SimpleStyleResolver<CardActionItemContentStyle>,
  actionItemLabel: StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle>,
  actionItemIcon: StyleResolverFunction<CardActionItemState, CardActionItemIconColor>,
  navigationItem: StyleResolverFunction<CardActionItemState, CardActionItemStyle>,
  navigationItemContent: SimpleStyleResolver<CardActionItemContentStyle>,
  navigationItemLabel: StyleResolverFunction<CardActionItemState, CardActionItemLabelStyle>,
  navigationItemIcon: StyleResolverFunction<CardActionItemState, CardActionItemIconColor>,
  navigationItemTrailing: SimpleStyleResolver<CardActionItemIconColor>,
}
