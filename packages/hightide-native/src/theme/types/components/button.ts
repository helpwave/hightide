import type { ViewStyle, TextStyle } from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme-tokens'
import type {
  ColoringType,
  PressableColoringStyle
} from '@helpwave/hightide-design/theme-tokens'

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
  container: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
