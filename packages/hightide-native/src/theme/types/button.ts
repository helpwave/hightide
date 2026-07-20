import type {
  ButtonColoringStyle,
  ColorValue,
  ColoringType,
  ElementSize,
  FontWeight
} from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type ButtonState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
}

export type ButtonStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorValue | 'transparent',
  borderColor?: ColorValue,
  borderWidth: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  minWidth: number,
  minHeight: number,
  borderRadius: number,
  opacity: number,
}

export type ButtonTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ButtonTheme = {
  button: ResolverFunction<ButtonState, ButtonStyle>,
  text: ResolverFunction<ButtonState, ButtonTextStyle>,
}
