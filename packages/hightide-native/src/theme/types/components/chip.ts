import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ChipColoringStyle,
  ColoringType,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'

import type { StyleResolverFunction } from '../resolver'

export type ChipState = {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: ChipColoringStyle,
}

export type ChipStyle = ViewStyle

export type ChipTextStyle = TextStyle

export type ChipTheme = {
  chip: StyleResolverFunction<ChipState, ChipStyle>,
  text: StyleResolverFunction<ChipState, ChipTextStyle>,
}
