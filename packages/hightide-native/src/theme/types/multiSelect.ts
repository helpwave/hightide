import type { ColorValue } from '@helpwave/hightide-design'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { StyleResolverFunction } from './resolver'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTriggerTextStyle
} from './select'

export type MultiSelectState = SelectState & {
  hasSelections?: boolean,
}

export type MultiSelectOptionState = SelectOptionState

export type MultiSelectTriggerStyle = StyleProp<ViewStyle>

export type MultiSelectOptionStyle = StyleProp<ViewStyle>

export type MultiSelectOptionTextStyle = StyleProp<TextStyle>

export type MultiSelectCheckboxStyle = StyleProp<ViewStyle>

export type MultiSelectCheckboxIconStyle = {
  color: ColorValue,
  visible: boolean,
}

export type MultiSelectTheme = {
  trigger: StyleResolverFunction<MultiSelectState, MultiSelectTriggerStyle>,
  triggerText: StyleResolverFunction<MultiSelectState, SelectTriggerTextStyle>,
  overlay: StyleResolverFunction<MultiSelectState, SelectOverlayStyle>,
  menu: StyleResolverFunction<MultiSelectState, SelectMenuStyle>,
  search: StyleResolverFunction<MultiSelectState, SelectSearchStyle>,
  searchPlaceholderColor: StyleResolverFunction<MultiSelectState, ColorValue>,
  option: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionStyle>,
  optionText: StyleResolverFunction<MultiSelectOptionState, MultiSelectOptionTextStyle>,
  checkbox: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxStyle>,
  checkboxIcon: StyleResolverFunction<MultiSelectOptionState, MultiSelectCheckboxIconStyle>,
}
