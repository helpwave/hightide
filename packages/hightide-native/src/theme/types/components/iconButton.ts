import type { ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type IconButtonState = TokenContextInput

export type IconButtonStyle = ViewStyle
export type IconButtonIconStyle = IconStyle

export type IconButtonThemeResolvers = {
  container: StyleLeaf<IconButtonStyle>,
  stateLayer: StyleLeaf<IconButtonStyle>,
  icon: StyleLeaf<IconButtonIconStyle>,
}
