import type {
  ListItemAppearance,
  ListPositionToken
} from '@helpwave/hightide-design/component-token-resolvers'
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
  position?: ListPositionToken,
  appearance?: ListItemAppearance,
}

export type ListItemStyle = ViewStyle

export type ListItemContentStyle = ViewStyle

export type ListItemDescriptionStyle = TextStyle

export type ListItemTitleStyle = TextStyle

export type ListItemIconStyle = IconStyle

export type ListItemDefaultThemeResolvers = {
  container: StyleResolverFunction<ListItemState, ListItemStyle>,
  content: StyleResolverFunction<ListItemState, ListItemContentStyle>,
  descriptionText: StyleResolverFunction<ListItemState, ListItemDescriptionStyle>,
  titleText: StyleResolverFunction<ListItemState, ListItemTitleStyle>,
  icon: StyleResolverFunction<ListItemState, ListItemIconStyle>,
}

export type ListActionItemState = InteractionState & {
  color?: ColorPairToken,
  position?: ListPositionToken,
  appearance?: ListItemAppearance,
}

export type ListActionItemStyle = ViewStyle

export type ListActionItemContentStyle = ViewStyle

export type ListActionItemTitleStyle = TextStyle

export type ListActionItemIconStyle = IconStyle

export type ListActionItemThemeResolvers = {
  container: StyleResolverFunction<ListActionItemState, ListActionItemStyle>,
  content: StyleResolverFunction<ListActionItemState, ListActionItemContentStyle>,
  titleText: StyleResolverFunction<ListActionItemState, ListActionItemTitleStyle>,
  icon: StyleResolverFunction<ListActionItemState, ListActionItemIconStyle>,
}

export type ListNavigationItemState = ListActionItemState

export type ListNavigationItemStyle = ListActionItemStyle

export type ListNavigationItemContentStyle = ListActionItemContentStyle

export type ListNavigationItemTitleStyle = ListActionItemTitleStyle

export type ListNavigationItemIconStyle = ListActionItemIconStyle

export type ListNavigationItemThemeResolvers = ListActionItemThemeResolvers

export type ListItemThemeResolvers = {
  default: ListItemDefaultThemeResolvers,
  action: ListActionItemThemeResolvers,
  navigation: ListNavigationItemThemeResolvers,
}
