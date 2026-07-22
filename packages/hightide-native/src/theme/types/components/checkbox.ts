import type { ElementSize } from '@helpwave/hightide-design/types'
import type { ViewStyle } from 'react-native'
import type { Color } from '../color'
import type { InteractionState, StyleResolverFunction } from '../resolver'

export type CheckboxSize = 'sm' | 'md' | 'lg'

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
  size: Exclude<ElementSize, 'xs'>,
  visible: boolean,
}

export type CheckboxTheme = {
  checkbox: StyleResolverFunction<CheckboxState, CheckboxStyle>,
  icon: StyleResolverFunction<CheckboxState, CheckboxIconStyle>,
}
