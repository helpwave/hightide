import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ChipColoringStyle,
  ColorPairToken,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'

import type { StyleResolverFunction } from '../resolver'

export type ChipState = {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: ChipColoringStyle,
}

export type ChipStyle = ViewStyle

export type ChipTextStyle = TextStyle

export type ChipThemeResolvers = {
  chip: StyleResolverFunction<ChipState, ChipStyle>,
  text: StyleResolverFunction<ChipState, ChipTextStyle>,
}
