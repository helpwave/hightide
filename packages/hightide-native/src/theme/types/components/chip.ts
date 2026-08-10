import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ChipVariant, ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'

import type { StyleResolverFunction } from '../resolver'

export type ChipState = {
  size?: ComponentSize,
  color?: ColorPairToken,
  variant?: ChipVariant,
}

export type ChipStyle = ViewStyle

export type ChipTextStyle = TextStyle

export type ChipThemeResolvers = {
  chip: StyleResolverFunction<ChipState, ChipStyle>,
  text: StyleResolverFunction<ChipState, ChipTextStyle>,
}
