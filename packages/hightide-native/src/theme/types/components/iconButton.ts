import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type {
  ComponentSize,
  PressableVariant
} from '@helpwave/hightide-design/semantic-token-resolvers'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type IconButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  variant?: PressableVariant,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = {
  size?: number,
  strokeWidth?: number,
  color?: Color,
}

export type IconButtonTextStyle = TextStyle

export type IconButtonThemeResolvers = {
  touchTarget: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  visualContainer: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  stateLayer: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
  text: StyleResolverFunction<IconButtonState, IconButtonTextStyle>,
}
