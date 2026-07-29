import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ElementSize } from '@helpwave/hightide-design/primitive'
import type {
  ColoringType,
  ChipColoringStyle
} from '@helpwave/hightide-design/design-system'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

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
