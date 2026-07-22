import type { ViewStyle } from 'react-native'

import type { ElementSize } from '@helpwave/hightide-design/types'

import type { Color } from '@/src/theme/types/color'
import type {
  InteractionState,
  StyleResolverFunction
} from '@/src/theme/types/resolver'

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
