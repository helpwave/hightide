import type { ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type CheckboxState = TokenContextInput
export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type CheckboxStyle = ViewStyle
export type CheckboxStateLayerStyle = ViewStyle
export type CheckboxIconStyle = IconStyle

export type CheckboxThemeResolvers = {
  container: StyleLeaf<CheckboxStyle>,
  stateLayer: StyleLeaf<CheckboxStateLayerStyle>,
  icon: StyleLeaf<CheckboxIconStyle>,
}
