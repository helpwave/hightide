import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type ThemedPressableState = TokenContextInput

export type ThemedPressableStyle = ViewStyle
export type ThemedPressableTextStyle = TextStyle
export type ThemedPressableIconStyle = IconStyle

export type ThemedPressableThemeResolvers = {
  container: StyleLeaf<ThemedPressableStyle>,
  stateLayer: StyleLeaf<ThemedPressableStyle>,
  icon: StyleLeaf<ThemedPressableIconStyle>,
  text: StyleLeaf<ThemedPressableTextStyle>,
}
