import type { ColorValue } from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type InputState = InteractionState & {
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputStyle = {
  minHeight: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorValue,
  backgroundColor: ColorValue,
  color: ColorValue,
  fontSize: number,
  opacity: number,
}

export type InputTheme = {
  input: ResolverFunction<InputState, InputStyle>,
  placeholderColor: ResolverFunction<InputState, ColorValue>,
}
