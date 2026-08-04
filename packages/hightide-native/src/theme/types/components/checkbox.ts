import type { ViewStyle } from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type CheckboxSize = ComponentSize

export type CheckboxState = InteractionState & {
  size?: CheckboxSize,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isInvalid?: boolean,
  isRounded?: boolean,
  alwaysShowCheckIcon?: boolean,
}

export type CheckboxStyle = ViewStyle

export type CheckboxIconStyle = {
  color: Color,
  size: number,
  visible: boolean,
}

export type CheckboxTheme = {
  checkbox: StyleResolverFunction<CheckboxState, CheckboxStyle>,
  icon: StyleResolverFunction<CheckboxState, CheckboxIconStyle>,
}
