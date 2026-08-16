import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type {
  ComponentSize,
  IconButtonVariant
} from '@helpwave/hightide-design/semantic-token-resolvers'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type IconButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  variant?: IconButtonVariant,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = IconStyle

export type IconButtonTextStyle = TextStyle

export type IconButtonThemeResolvers = {
  container: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  stateLayer: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
  text: StyleResolverFunction<IconButtonState, IconButtonTextStyle>,
}
