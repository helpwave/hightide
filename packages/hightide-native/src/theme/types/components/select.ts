import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type SelectState = TokenContextInput
export type SelectMenuState = TokenContextInput
export type SelectOptionState = TokenContextInput

export type SelectTriggerStyle = ViewStyle
export type SelectTriggerTextStyle = TextStyle
export type SelectIconStyle = IconStyle
export type SelectOverlayStyle = ViewStyle
export type SelectMenuStyle = ViewStyle
export type SelectHeaderStyle = ViewStyle
export type SelectOptionStyle = ViewStyle
export type SelectOptionTextStyle = TextStyle
export type SelectEmptyTextStyle = TextStyle

export type SelectThemeResolvers = {
  trigger: StyleLeaf<SelectTriggerStyle>,
  stateLayer: StyleLeaf<SelectTriggerStyle>,
  triggerText: StyleLeaf<SelectTriggerTextStyle>,
  icon: StyleLeaf<SelectIconStyle>,
  overlay: StyleLeaf<SelectOverlayStyle>,
  menu: StyleLeaf<SelectMenuStyle>,
  header: StyleLeaf<SelectHeaderStyle>,
  option: StyleLeaf<SelectOptionStyle>,
  optionText: StyleLeaf<SelectOptionTextStyle>,
  emptyText: StyleLeaf<SelectEmptyTextStyle>,
}
