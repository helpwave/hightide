import type {
  ButtonColoringStyle,
  ColorValue,
  ColoringType,
  ElementSize
} from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type IconButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type IconButtonStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorValue | 'transparent',
  borderColor?: ColorValue,
  borderWidth: number,
  width: number,
  height: number,
  borderRadius: number,
  opacity: number,
}

export type IconButtonIconStyle = {
  color: ColorValue,
}

export type IconButtonTheme = {
  button: ResolverFunction<IconButtonState, IconButtonStyle>,
  icon: ResolverFunction<IconButtonState, IconButtonIconStyle>,
}
