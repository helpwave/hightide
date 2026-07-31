import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentSizeBasic } from '@helpwave/hightide-design/theme-tokens'
import type {
  ColoringType,
  PressableColoringStyle
} from '@helpwave/hightide-design/semantic-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type ButtonState = InteractionState & {
  size?: ComponentSizeBasic,
  color?: ColoringType,
  coloringStyle?: PressableColoringStyle,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonTheme = {
  button: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
