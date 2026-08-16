import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type ListItemState = {
  color?: ColorPairToken,
}

export type ListItemStyle = ViewStyle

export type ListItemLeadingItemContainerStyle = ViewStyle

export type ListItemContentStyle = ViewStyle

export type ListItemTrailingItemContainerStyle = ViewStyle

export type ListItemDescriptionStyle = TextStyle

export type ListItemTitleStyle = TextStyle

export type ListItemIconStyle = IconStyle

export type ListItemDefaultThemeResolvers = {
  container: StyleResolverFunction<ListItemState, ListItemStyle>,
  leadingItemContainer: StyleResolverFunction<ListItemState, ListItemLeadingItemContainerStyle>,
  content: StyleResolverFunction<ListItemState, ListItemContentStyle>,
  trailingItemContainer: StyleResolverFunction<ListItemState, ListItemTrailingItemContainerStyle>,
  descriptionText: StyleResolverFunction<ListItemState, ListItemDescriptionStyle>,
  titleText: StyleResolverFunction<ListItemState, ListItemTitleStyle>,
  icon: StyleResolverFunction<ListItemState, ListItemIconStyle>,
}

export type ListActionItemState = InteractionState & {
  color?: ColorPairToken,
}

export type ListActionItemStyle = ViewStyle

export type ListActionItemLeadingItemContainerStyle = ViewStyle

export type ListActionItemContentStyle = ViewStyle

export type ListActionItemTrailingItemContainerStyle = ViewStyle

export type ListActionItemTitleStyle = TextStyle

export type ListActionItemIconStyle = IconStyle

export type ListActionItemThemeResolvers = {
  container: StyleResolverFunction<ListActionItemState, ListActionItemStyle>,
  leadingItemContainer: StyleResolverFunction<ListActionItemState, ListActionItemLeadingItemContainerStyle>,
  content: StyleResolverFunction<ListActionItemState, ListActionItemContentStyle>,
  trailingItemContainer: StyleResolverFunction<ListActionItemState, ListActionItemTrailingItemContainerStyle>,
  titleText: StyleResolverFunction<ListActionItemState, ListActionItemTitleStyle>,
  icon: StyleResolverFunction<ListActionItemState, ListActionItemIconStyle>,
}

export type ListNavigationItemState = ListActionItemState

export type ListNavigationItemStyle = ListActionItemStyle

export type ListNavigationItemLeadingItemContainerStyle = ListActionItemLeadingItemContainerStyle

export type ListNavigationItemContentStyle = ListActionItemContentStyle

export type ListNavigationItemTrailingItemContainerStyle = ListActionItemTrailingItemContainerStyle

export type ListNavigationItemTitleStyle = ListActionItemTitleStyle

export type ListNavigationItemIconStyle = ListActionItemIconStyle

export type ListNavigationItemThemeResolvers = ListActionItemThemeResolvers

export type ListItemThemeResolvers = {
  default: ListItemDefaultThemeResolvers,
  action: ListActionItemThemeResolvers,
  navigation: ListNavigationItemThemeResolvers,
}
