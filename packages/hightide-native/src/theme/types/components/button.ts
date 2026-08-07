import type { ViewStyle, TextStyle } from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'
import type {
  ColorPairToken,
  PressableColoringStyle
} from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type ButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: PressableColoringStyle,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonThemeResolvers = {
  container: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
