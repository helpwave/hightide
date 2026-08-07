import type { ViewStyle } from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type CheckboxSize = ComponentSize

export type CheckboxState = InteractionState & {
  size?: CheckboxSize,
  color?: ColorPairToken,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isRounded?: boolean,
}

export type CheckboxStyle = ViewStyle

export type CheckboxVisualContainerStyle = ViewStyle

export type CheckboxIconStyle = {
  color?: Color,
  size?: number,
  strokeWidth?: number,
}

export type CheckboxThemeResolvers = {
  container: StyleResolverFunction<CheckboxState, CheckboxStyle>,
  visualContainer: StyleResolverFunction<CheckboxState, CheckboxVisualContainerStyle>,
  icon: StyleResolverFunction<CheckboxState, CheckboxIconStyle>,
}
