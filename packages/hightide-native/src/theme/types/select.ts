import type { ColorValue, FontWeight } from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

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

export type SelectTriggerStyle = {
  minHeight: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorValue,
  backgroundColor: ColorValue,
  justifyContent: 'center',
  opacity: number,
}

export type SelectTriggerTextStyle = {
  color: ColorValue,
}

export type SelectOverlayStyle = {
  flex: 1,
  backgroundColor: ColorValue,
  justifyContent: 'center',
  padding: number,
}

export type SelectMenuStyle = {
  maxHeight: number,
  borderRadius: number,
  backgroundColor: ColorValue,
  borderWidth: number,
  borderColor: ColorValue,
  overflow: 'hidden',
}

export type SelectSearchStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  borderBottomWidth: number,
  borderBottomColor: ColorValue,
  color: ColorValue,
}

export type SelectOptionStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  backgroundColor: ColorValue | 'transparent',
  opacity: number,
}

export type SelectOptionTextStyle = {
  color: ColorValue,
  fontWeight: FontWeight,
}

export type SelectTheme = {
  trigger: ResolverFunction<SelectState, SelectTriggerStyle>,
  triggerText: ResolverFunction<SelectState, SelectTriggerTextStyle>,
  overlay: ResolverFunction<SelectState, SelectOverlayStyle>,
  menu: ResolverFunction<SelectState, SelectMenuStyle>,
  search: ResolverFunction<SelectState, SelectSearchStyle>,
  searchPlaceholderColor: ResolverFunction<SelectState, ColorValue>,
  option: ResolverFunction<SelectOptionState, SelectOptionStyle>,
  optionText: ResolverFunction<SelectOptionState, SelectOptionTextStyle>,
}
