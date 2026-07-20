import type {
  ChipColoringStyle,
  ColorValue,
  ColoringType,
  ElementSize,
  FontWeight
} from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type ChipState = InteractionState & {
  size?: ElementSize,
  color?: ColoringType,
  coloringStyle?: ChipColoringStyle,
}

export type ChipStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-start',
  backgroundColor: ColorValue | 'transparent',
  borderColor?: ColorValue,
  borderWidth: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  minHeight: number,
  borderRadius: number,
  opacity: number,
}

export type ChipTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChipTheme = {
  chip: ResolverFunction<ChipState, ChipStyle>,
  text: ResolverFunction<ChipState, ChipTextStyle>,
}
