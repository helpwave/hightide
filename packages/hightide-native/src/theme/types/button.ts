import type { ButtonColoringStyle, ColoringType, ElementSize } from '@helpwave/hightide-design'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type ButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type ButtonStyle = StyleProp<ViewStyle>

export type ButtonTextStyle = StyleProp<TextStyle>

export type ButtonTheme = {
  button: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
