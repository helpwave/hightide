import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  SimpleStyleResolver,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'

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

export type SelectIconStyle = IconStyle

export type SelectMenuState = {
  hasSearch?: boolean,
}

export type SelectOverlayStyle = ViewStyle

export type SelectMenuStyle = ViewStyle

export type SelectHeaderStyle = ViewStyle

export type SelectOptionStyle = ViewStyle

export type SelectOptionTextStyle = TextStyle

export type SelectEmptyTextStyle = TextStyle

export type SelectThemeResolvers = {
  trigger: StyleResolverFunction<SelectState, SelectTriggerStyle>,
  triggerText: StyleResolverFunction<SelectState, SelectTriggerTextStyle>,
  icon: StyleResolverFunction<SelectState, SelectIconStyle>,
  overlay: SimpleStyleResolver<SelectOverlayStyle>,
  menu: StyleResolverFunction<SelectMenuState, SelectMenuStyle>,
  header: SimpleStyleResolver<SelectHeaderStyle>,
  option: StyleResolverFunction<SelectOptionState, SelectOptionStyle>,
  optionText: StyleResolverFunction<SelectOptionState, SelectOptionTextStyle>,
  emptyText: SimpleStyleResolver<SelectEmptyTextStyle>,
}
