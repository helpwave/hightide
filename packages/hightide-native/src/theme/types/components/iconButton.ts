import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ColorPairToken,
  PressableColoringStyle
} from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'

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
  size?: number,
  strokeWidth?: number,
  color?: Color,
}

export type IconButtonTextStyle = TextStyle

export type IconButtonThemeResolvers = {
  button: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
  text: StyleResolverFunction<IconButtonState, IconButtonTextStyle>,
}
