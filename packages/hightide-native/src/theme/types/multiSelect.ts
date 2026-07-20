import type { ColorValue, FontWeight } from '@helpwave/hightide-design'
import type { ResolverFunction } from './resolver'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from './select'

export type MultiSelectState = SelectState & {
  hasSelections?: boolean,
}

export type MultiSelectOptionState = SelectOptionState

export type MultiSelectTriggerStyle = SelectTriggerStyle & {
  gap: number,
}

export type MultiSelectOptionStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  backgroundColor: ColorValue | 'transparent',
  opacity: number,
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
}

export type MultiSelectOptionTextStyle = {
  color: ColorValue,
  fontWeight: FontWeight,
}

export type MultiSelectCheckboxStyle = {
  width: number,
  height: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorValue,
  backgroundColor: ColorValue | 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
}

export type MultiSelectCheckboxIconStyle = {
  color: ColorValue,
  visible: boolean,
}

export type MultiSelectTheme = {
  trigger: ResolverFunction<MultiSelectState, MultiSelectTriggerStyle>,
  triggerText: ResolverFunction<MultiSelectState, SelectTriggerTextStyle>,
  overlay: ResolverFunction<MultiSelectState, SelectOverlayStyle>,
  menu: ResolverFunction<MultiSelectState, SelectMenuStyle>,
  search: ResolverFunction<MultiSelectState, SelectSearchStyle>,
  searchPlaceholderColor: ResolverFunction<MultiSelectState, ColorValue>,
  option: ResolverFunction<MultiSelectOptionState, MultiSelectOptionStyle>,
  optionText: ResolverFunction<MultiSelectOptionState, MultiSelectOptionTextStyle>,
  checkbox: ResolverFunction<MultiSelectOptionState, MultiSelectCheckboxStyle>,
  checkboxIcon: ResolverFunction<MultiSelectOptionState, MultiSelectCheckboxIconStyle>,
}
