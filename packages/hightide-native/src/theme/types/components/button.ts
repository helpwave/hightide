import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/component-tokens'
import type {
  ColoringType,
  PressableColoringStyle
} from '@helpwave/hightide-design/semantic-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type ButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: PressableColoringStyle,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonTheme = {
  button: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
