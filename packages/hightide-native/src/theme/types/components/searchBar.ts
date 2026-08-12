import type { TextStyle, ViewStyle } from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type SearchBarState = InteractionState & {
  color?: ColorPairToken,
}

export type SearchBarContainerStyle = ViewStyle

export type SearchBarInputStyle = TextStyle

export type SearchBarPlaceholderStyle = TextStyle

export type SearchBarIconButtonStyle = ViewStyle

export type SearchBarThemeResolvers = {
  container: StyleResolverFunction<SearchBarState, SearchBarContainerStyle>,
  input: StyleResolverFunction<SearchBarState, SearchBarInputStyle>,
  placeholder: StyleResolverFunction<SearchBarState, SearchBarPlaceholderStyle>,
  iconButton: StyleResolverFunction<SearchBarState, SearchBarIconButtonStyle>,
  iconButtonColor: StyleResolverFunction<SearchBarState, ColorPairToken>,
}
