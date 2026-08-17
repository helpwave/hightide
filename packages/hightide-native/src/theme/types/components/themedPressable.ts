import type { TextStyle, ViewStyle } from 'react-native'

import type {
  ColoringColorVariant,
  ColoringStyle,
  ComponentSize
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type ThemedPressableState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: ColoringStyle,
  coloringColorVariant?: ColoringColorVariant,
  hasAdditionalHorizontalPadding?: boolean,
}

export type ThemedPressableStyle = ViewStyle

export type ThemedPressableTextStyle = TextStyle

export type ThemedPressableIconStyle = IconStyle

export type ThemedPressableThemeResolvers = {
  container: StyleResolverFunction<ThemedPressableState, ThemedPressableStyle>,
  stateLayer: StyleResolverFunction<ThemedPressableState, ThemedPressableStyle>,
  icon: StyleResolverFunction<ThemedPressableState, ThemedPressableIconStyle>,
  text: StyleResolverFunction<ThemedPressableState, ThemedPressableTextStyle>,
}
