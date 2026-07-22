import type { ColoringType } from '@helpwave/hightide-design/helpers'
import type { ChipColoringStyle, ElementSize } from '@helpwave/hightide-design/types'
import type { TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from '../resolver'

export type ChipState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ChipColoringStyle,
}

export type ChipStyle = ViewStyle

export type ChipTextStyle = TextStyle

export type ChipTheme = {
  chip: StyleResolverFunction<ChipState, ChipStyle>,
  text: StyleResolverFunction<ChipState, ChipTextStyle>,
}
