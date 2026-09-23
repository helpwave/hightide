import type { ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'

export type SwitchState = TokenContextInput

export type SwitchContainerStyle = ViewStyle
export type SwitchTrackStyle = ViewStyle
export type SwitchThumbStyle = ViewStyle

export type SwitchThemeResolvers = {
  container: StyleLeaf<SwitchContainerStyle>,
  track: StyleLeaf<SwitchTrackStyle>,
  thumb: StyleLeaf<SwitchThumbStyle>,
}
