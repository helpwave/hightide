import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme'
import type {
  ColoringType,
  ButtonColoringStyle
} from '@helpwave/hightide-design/design-system'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type ButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonTheme = {
  button: StyleResolverFunction<ButtonState, ButtonStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
