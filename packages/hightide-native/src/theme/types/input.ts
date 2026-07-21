import type { ColorValue } from '@helpwave/hightide-design'
import type { TextStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type InputState = InteractionState & {
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputStyle = TextStyle

export type InputTheme = {
  input: StyleResolverFunction<InputState, InputStyle>,
  placeholderColor: StyleResolverFunction<InputState, ColorValue>,
}
