import type { TextStyle } from 'react-native'

import type { Color } from '@/src/theme/types/color'
import type {
  InteractionState,
  StyleResolverFunction
} from '@/src/theme/types/resolver'

export type InputState = InteractionState & {
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputStyle = TextStyle

export type InputTheme = {
  input: StyleResolverFunction<InputState, InputStyle>,
  placeholderColor: StyleResolverFunction<InputState, Color>,
}
