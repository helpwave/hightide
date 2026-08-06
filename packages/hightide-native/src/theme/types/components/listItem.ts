import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type ListItemState = {
  color?: ColorPairToken,
}

export type ListItemStyle = ViewStyle

export type ListItemContentStyle = ViewStyle

export type ListItemDescriptionStyle = TextStyle

export type ListItemTitleStyle = TextStyle

export type ListItemIconStyle = {
  size: number,
  strokeWidth: number,
  color: Color,
}

export type ListItemDefaultThemeResolvers = {
  container: StyleResolverFunction<ListItemState, ListItemStyle>,
  content: StyleResolverFunction<ListItemState, ListItemContentStyle>,
  descriptionText: StyleResolverFunction<ListItemState, ListItemDescriptionStyle>,
  titleText: StyleResolverFunction<ListItemState, ListItemTitleStyle>,
  icon: StyleResolverFunction<ListItemState, ListItemIconStyle>,
}

export type ListActionItemState = InteractionState & {
  color?: ColorPairToken,
}

export type ListActionItemStyle = ViewStyle

export type ListActionItemContentStyle = ViewStyle

export type ListActionItemTitleStyle = TextStyle

export type ListActionItemIconStyle = {
  size: number,
  strokeWidth: number,
  color: Color,
}

export type ListActionItemThemeResolvers = {
  container: StyleResolverFunction<ListActionItemState, ListActionItemStyle>,
  content: StyleResolverFunction<ListActionItemState, ListActionItemContentStyle>,
  titleText: StyleResolverFunction<ListActionItemState, ListActionItemTitleStyle>,
  icon: StyleResolverFunction<ListActionItemState, ListActionItemIconStyle>,
}

export type ListNavigationItemState = InteractionState & {
  color?: ColorPairToken,
}

export type ListNavigationItemStyle = ViewStyle

export type ListNavigationItemContentStyle = ViewStyle

export type ListNavigationItemTitleStyle = TextStyle

export type ListNavigationItemIconStyle = {
  size: number,
  strokeWidth: number,
  color: Color,
}

export type ListNavigationItemThemeResolvers = {
  container: StyleResolverFunction<ListNavigationItemState, ListNavigationItemStyle>,
  content: StyleResolverFunction<ListNavigationItemState, ListNavigationItemContentStyle>,
  titleText: StyleResolverFunction<ListNavigationItemState, ListNavigationItemTitleStyle>,
  icon: StyleResolverFunction<ListNavigationItemState, ListNavigationItemIconStyle>,
}

export type ListItemThemeResolvers = {
  default: ListItemDefaultThemeResolvers,
  action: ListActionItemThemeResolvers,
  navigation: ListNavigationItemThemeResolvers,
}
