import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'
import type {
  SelectEmptyTextStyle,
  SelectHeaderStyle,
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectTriggerTextStyle
} from './select'

export type MultiSelectState = TokenContextInput
export type MultiSelectOptionState = TokenContextInput

export type MultiSelectTriggerStyle = ViewStyle
export type MultiSelectOptionStyle = ViewStyle
export type MultiSelectOptionTextStyle = TextStyle
export type MultiSelectCheckboxStyle = ViewStyle
export type MultiSelectCheckboxIconStyle = IconStyle

export type MultiSelectThemeResolvers = {
  trigger: StyleLeaf<MultiSelectTriggerStyle>,
  stateLayer: StyleLeaf<MultiSelectTriggerStyle>,
  triggerText: StyleLeaf<SelectTriggerTextStyle>,
  overlay: StyleLeaf<SelectOverlayStyle>,
  menu: StyleLeaf<SelectMenuStyle>,
  header: StyleLeaf<SelectHeaderStyle>,
  option: StyleLeaf<MultiSelectOptionStyle>,
  optionText: StyleLeaf<MultiSelectOptionTextStyle>,
  emptyText: StyleLeaf<SelectEmptyTextStyle>,
  checkbox: StyleLeaf<MultiSelectCheckboxStyle>,
  checkboxIcon: StyleLeaf<MultiSelectCheckboxIconStyle>,
}
