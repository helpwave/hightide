import type { ViewStyle } from 'react-native'

import type { ColoringType } from '@helpwave/hightide-design/helpers'
import type {
  ButtonColoringStyle,
  ElementSize
} from '@helpwave/hightide-design/types'

import type { Color } from '@/src/theme/types/color'
import type {
  InteractionState,
  StyleResolverFunction
} from '@/src/theme/types/resolver'

export type IconButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = {
  color: Color,
}

export type IconButtonTheme = {
  button: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
}
