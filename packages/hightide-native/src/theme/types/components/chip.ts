import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type ChipState = TokenContextInput

export type ChipStyle = ViewStyle
export type ChipTextStyle = TextStyle
export type ChipIconStyle = IconStyle

export type ChipThemeResolvers = {
  container: StyleLeaf<ChipStyle>,
  icon: StyleLeaf<ChipIconStyle>,
  text: StyleLeaf<ChipTextStyle>,
}
