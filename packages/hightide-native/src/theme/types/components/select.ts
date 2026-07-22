import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '@/src/theme/types/color'
import type {
  InteractionState,
  StyleResolverFunction
} from '@/src/theme/types/resolver'

export type SelectState = InteractionState & {
  isInvalid?: boolean,
  isReadOnly?: boolean,
  isOpen?: boolean,
  hasValue?: boolean,
}

export type SelectOptionState = InteractionState & {
  isSelected?: boolean,
  isHighlighted?: boolean,
}

export type SelectTriggerStyle = ViewStyle

export type SelectTriggerTextStyle = TextStyle

export type SelectOverlayStyle = ViewStyle

export type SelectMenuStyle = ViewStyle

export type SelectSearchStyle = TextStyle

export type SelectOptionStyle = ViewStyle

export type SelectOptionTextStyle = TextStyle

export type SelectTheme = {
  trigger: StyleResolverFunction<SelectState, SelectTriggerStyle>,
  triggerText: StyleResolverFunction<SelectState, SelectTriggerTextStyle>,
  overlay: StyleResolverFunction<SelectState, SelectOverlayStyle>,
  menu: StyleResolverFunction<SelectState, SelectMenuStyle>,
  search: StyleResolverFunction<SelectState, SelectSearchStyle>,
  searchPlaceholderColor: StyleResolverFunction<SelectState, Color>,
  option: StyleResolverFunction<SelectOptionState, SelectOptionStyle>,
  optionText: StyleResolverFunction<SelectOptionState, SelectOptionTextStyle>,
}
