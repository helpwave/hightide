import type { ColorValue } from '@helpwave/hightide-design'
import type { StyleProp, TextStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type InputState = InteractionState & {
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputStyle = StyleProp<TextStyle>

export type InputTheme = {
  input: StyleResolverFunction<InputState, InputStyle>,
  placeholderColor: StyleResolverFunction<InputState, ColorValue>,
}
