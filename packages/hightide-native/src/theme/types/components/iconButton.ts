import type { ViewStyle } from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/component-tokens'
import type {
  ColoringType,
  PressableColoringStyle
} from '@helpwave/hightide-design/semantic-tokens'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type IconButtonState = InteractionState & {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: PressableColoringStyle,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = {
  color: Color,
}

export type IconButtonTheme = {
  button: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
}
