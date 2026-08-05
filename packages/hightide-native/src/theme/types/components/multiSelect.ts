import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { Color } from '../color'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTriggerTextStyle
} from './select'
import type {
  SimpleStyleResolver,
  StyleResolverFunction
} from '../resolver'

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

export type MultiSelectThemeResolvers = {
  trigger: StyleResolverFunction<MultiSelectState, MultiSelectTriggerStyle>,
  triggerText: SimpleStyleResolver<SelectTriggerTextStyle>,
  overlay: SimpleStyleResolver<SelectOverlayStyle>,
  menu: SimpleStyleResolver<SelectMenuStyle>,
  search: SimpleStyleResolver<SelectSearchStyle>,
  searchPlaceholderColor: SimpleStyleResolver<Color>,
  option: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionStyle>,
  optionText: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionTextStyle>,
  checkbox: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxStyle>,
  checkboxIcon: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxIconStyle>,
}
