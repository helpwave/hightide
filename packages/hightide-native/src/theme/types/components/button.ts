import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ElementSize } from '@helpwave/hightide-design/primitive'
import type {
  ColoringType,
  ButtonColoringStyle
} from '@helpwave/hightide-design/theme'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

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
