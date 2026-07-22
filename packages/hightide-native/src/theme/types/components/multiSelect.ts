import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '@/src/theme/types/color'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTriggerTextStyle
} from '@/src/theme/types/components/select'
import type { StyleResolverFunction } from '@/src/theme/types/resolver'

export type MultiSelectState = SelectState & {
  hasSelections?: boolean,
}

export type MultiSelectOptionState = SelectOptionState

export type MultiSelectTriggerStyle = ViewStyle

export type MultiSelectOptionStyle = ViewStyle

export type MultiSelectOptionTextStyle = TextStyle

export type MultiSelectCheckboxStyle = ViewStyle

export type MultiSelectCheckboxIconStyle = {
  color: Color,
  visible: boolean,
}

export type MultiSelectTheme = {
  trigger: StyleResolverFunction<MultiSelectState, MultiSelectTriggerStyle>,
  triggerText: StyleResolverFunction<MultiSelectState, SelectTriggerTextStyle>,
  overlay: StyleResolverFunction<MultiSelectState, SelectOverlayStyle>,
  menu: StyleResolverFunction<MultiSelectState, SelectMenuStyle>,
  search: StyleResolverFunction<MultiSelectState, SelectSearchStyle>,
  searchPlaceholderColor: StyleResolverFunction<MultiSelectState, Color>,
  option: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionStyle>,
  optionText: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionTextStyle>,
  checkbox: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxStyle>,
  checkboxIcon: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxIconStyle>,
}
