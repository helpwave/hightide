import type { ViewStyle, TextStyle } from 'react-native'

import type { ComponentSize, PressableVariant } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type ButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  variant?: PressableVariant,
}

export type ButtonStyle = ViewStyle

export type ButtonTextStyle = TextStyle

export type ButtonIconStyle = IconStyle

export type ButtonThemeResolvers = {
  touchTarget: StyleResolverFunction<ButtonState, ButtonStyle>,
  visualContainer: StyleResolverFunction<ButtonState, ButtonStyle>,
  stateLayer: StyleResolverFunction<ButtonState, ButtonStyle>,
  icon: StyleResolverFunction<ButtonState, ButtonIconStyle>,
  text: StyleResolverFunction<ButtonState, ButtonTextStyle>,
}
