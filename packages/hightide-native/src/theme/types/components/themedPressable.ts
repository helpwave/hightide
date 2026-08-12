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

export type ThemedPressableState = InteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: ColoringStyle,
  coloringColorVariant?: ColoringColorVariant,
  hasAdditionalHorizontalPadding?: boolean,
}

export type ThemedPressableStyle = ViewStyle

export type ThemedPressableTextStyle = TextStyle

export type ThemedPressableThemeResolvers = {
  touchTarget: StyleResolverFunction<ThemedPressableState, ThemedPressableStyle>,
  visualContainer: StyleResolverFunction<ThemedPressableState, ThemedPressableStyle>,
  stateLayer: StyleResolverFunction<ThemedPressableState, ThemedPressableStyle>,
  text: StyleResolverFunction<ThemedPressableState, ThemedPressableTextStyle>,
}
