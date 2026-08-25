import type { TextStyle, ViewStyle } from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type InputState = InteractionState & {
  color?: ColorPairToken,
}

export type InputContainerStyle = ViewStyle

export type InputStateLayerStyle = ViewStyle

export type InputTextStyle = TextStyle

export type InputPlaceholderStyle = TextStyle

export type InputIconStyle = IconStyle

export type InputThemeResolvers = {
  container: StyleResolverFunction<InputState, InputContainerStyle>,
  stateLayer: StyleResolverFunction<InputState, InputStateLayerStyle>,
  text: StyleResolverFunction<InputState, InputTextStyle>,
  placeholder: StyleResolverFunction<InputState, InputPlaceholderStyle>,
  icon: StyleResolverFunction<InputState, InputIconStyle>,
}
