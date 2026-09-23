import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type InputState = TokenContextInput

export type InputContainerStyle = ViewStyle
export type InputStateLayerStyle = ViewStyle
export type InputTextStyle = TextStyle
export type InputPlaceholderStyle = TextStyle
export type InputIconStyle = IconStyle

export type InputThemeResolvers = {
  container: StyleLeaf<InputContainerStyle>,
  stateLayer: StyleLeaf<InputStateLayerStyle>,
  text: StyleLeaf<InputTextStyle>,
  placeholder: StyleLeaf<InputPlaceholderStyle>,
  icon: StyleLeaf<InputIconStyle>,
}
