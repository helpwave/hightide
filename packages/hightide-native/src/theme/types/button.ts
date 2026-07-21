import type { ColoringType } from '@helpwave/hightide-design/helpers'
import type { ButtonColoringStyle, ElementSize } from '@helpwave/hightide-design/types'
import type { TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type ButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonTheme = {
  button: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
