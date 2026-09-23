import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'
import type { InputThemeResolvers } from './input'

export type SearchBarState = TokenContextInput

export type SearchBarContainerStyle = ViewStyle
export type SearchBarInputStyle = TextStyle
export type SearchBarPlaceholderStyle = TextStyle
export type SearchBarIconButtonStyle = ViewStyle

export type SearchBarThemeResolvers = {
  container: StyleLeaf<SearchBarContainerStyle>,
  input: InputThemeResolvers,
  iconButton: StyleLeaf<SearchBarIconButtonStyle>,
  icon: StyleLeaf<IconStyle>,
}
