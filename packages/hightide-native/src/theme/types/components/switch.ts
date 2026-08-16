import type { ViewStyle } from 'react-native'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type SwitchState = InteractionState & {
  isActive?: boolean,
}

export type SwitchContainerStyle = ViewStyle

export type SwitchTrackStyle = ViewStyle

export type SwitchThumbStyle = ViewStyle

export type SwitchThemeResolvers = {
  container: StyleResolverFunction<SwitchState, SwitchContainerStyle>,
  track: StyleResolverFunction<SwitchState, SwitchTrackStyle>,
  thumb: StyleResolverFunction<SwitchState, SwitchThumbStyle>,
}
