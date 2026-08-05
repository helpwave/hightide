import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ColorPairToken,
  ComponentSize,
  PressableColoringStyle
} from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type IconButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: PressableColoringStyle,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = {
  color: Color,
}

export type IconButtonTextStyle = TextStyle

export type IconButtonThemeResolvers = {
  button: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
  text: StyleResolverFunction<IconButtonState, IconButtonTextStyle>,
}
