import type { TextStyle, ViewStyle } from 'react-native'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type InputState = InteractionState

export type InputContainerStyle = ViewStyle

export type InputTextStyle = TextStyle

export type InputPlaceholderStyle = TextStyle

export type InputIconStyle = {
  size?: number,
  strokeWidth?: number,
  color?: Color,
}

export type InputThemeResolvers = {
  container: StyleResolverFunction<InputState, InputContainerStyle>,
  text: StyleResolverFunction<InputState, InputTextStyle>,
  placeholder: StyleResolverFunction<InputState, InputPlaceholderStyle>,
  icon: StyleResolverFunction<InputState, InputIconStyle>,
}
