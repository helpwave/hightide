import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type ListItemState = TokenContextInput
export type ListActionItemState = TokenContextInput

export type ListItemStyle = ViewStyle
export type ListItemLeadingItemContainerStyle = ViewStyle
export type ListItemContentStyle = ViewStyle
export type ListItemTrailingItemContainerStyle = ViewStyle
export type ListItemDescriptionStyle = TextStyle
export type ListItemTitleStyle = TextStyle
export type ListItemIconStyle = IconStyle

export type ListItemDefaultThemeResolvers = {
  container: StyleLeaf<ListItemStyle>,
  leadingItemContainer: StyleLeaf<ListItemLeadingItemContainerStyle>,
  content: StyleLeaf<ListItemContentStyle>,
  trailingItemContainer: StyleLeaf<ListItemTrailingItemContainerStyle>,
  descriptionText: StyleLeaf<ListItemDescriptionStyle>,
  titleText: StyleLeaf<ListItemTitleStyle>,
  icon: StyleLeaf<ListItemIconStyle>,
}

export type ListActionItemStyle = ViewStyle
export type ListActionItemTitleStyle = TextStyle
export type ListActionItemDescriptionStyle = TextStyle
export type ListActionItemIconStyle = IconStyle

export type ListActionItemThemeResolvers = ListItemDefaultThemeResolvers & {
  container: StyleLeaf<ListActionItemStyle>,
  titleText: StyleLeaf<ListActionItemTitleStyle>,
  descriptionText: StyleLeaf<ListActionItemDescriptionStyle>,
  icon: StyleLeaf<ListActionItemIconStyle>,
}

export type ListNavigationItemThemeResolvers = ListActionItemThemeResolvers
export type ListNavigationItemState = TokenContextInput
export type ListNavigationItemStyle = ListActionItemStyle
export type ListNavigationItemTitleStyle = ListActionItemTitleStyle
export type ListNavigationItemDescriptionStyle = ListActionItemDescriptionStyle

export type ListItemThemeResolvers = {
  default: ListItemDefaultThemeResolvers,
  action: ListActionItemThemeResolvers,
  navigation: ListNavigationItemThemeResolvers,
}
