import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../color'
import type {
  InteractionState,
  SimpleStyleResolver,
  StyleResolverFunction
} from '../resolver'

export type SelectState = InteractionState & {
  color?: ColorPairToken,
  isOpen?: boolean,
  hasValue?: boolean,
}

export type SelectOptionState = InteractionState & {
  color?: ColorPairToken,
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

export type SelectThemeResolvers = {
  trigger: StyleResolverFunction<SelectState, SelectTriggerStyle>,
  triggerText: StyleResolverFunction<SelectState, SelectTriggerTextStyle>,
  overlay: SimpleStyleResolver<SelectOverlayStyle>,
  menu: SimpleStyleResolver<SelectMenuStyle>,
  search: SimpleStyleResolver<SelectSearchStyle>,
  searchPlaceholderColor: SimpleStyleResolver<Color>,
  option: StyleResolverFunction<SelectOptionState, SelectOptionStyle>,
  optionText: StyleResolverFunction<SelectOptionState, SelectOptionTextStyle>,
}
