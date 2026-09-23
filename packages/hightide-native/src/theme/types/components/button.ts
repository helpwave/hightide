import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type ButtonState = TokenContextInput

export type ButtonStyle = ViewStyle
export type ButtonTextStyle = TextStyle
export type ButtonIconStyle = IconStyle

export type ButtonThemeResolvers = {
  container: StyleLeaf<ButtonStyle>,
  stateLayer: StyleLeaf<ButtonStyle>,
  icon: StyleLeaf<ButtonIconStyle>,
  text: StyleLeaf<ButtonTextStyle>,
}
