import type { ViewStyle } from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

export type CheckboxSize = ComponentSize

export type CheckboxState = InteractionState & {
  size?: CheckboxSize,
  color?: ColorPairToken,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isRounded?: boolean,
}

export type CheckboxStyle = ViewStyle

export type CheckboxStateLayerStyle = ViewStyle

export type CheckboxIconStyle = IconStyle

export type CheckboxThemeResolvers = {
  container: StyleResolverFunction<CheckboxState, CheckboxStyle>,
  stateLayer: StyleResolverFunction<CheckboxState, CheckboxStateLayerStyle>,
  icon: StyleResolverFunction<CheckboxState, CheckboxIconStyle>,
}
