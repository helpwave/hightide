import type { ButtonColoringStyle, ColorValue, ColoringType, ElementSize } from '@helpwave/hightide-design'
import type { ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type IconButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type IconButtonStyle = ViewStyle

export type IconButtonIconStyle = {
  color: ColorValue,
}

export type IconButtonTheme = {
  button: StyleResolverFunction<IconButtonState, IconButtonStyle>,
  icon: StyleResolverFunction<IconButtonState, IconButtonIconStyle>,
}
