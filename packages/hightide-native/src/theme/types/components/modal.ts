import type { ViewStyle } from 'react-native'
import type { StyleLeaf } from '../resolver'

export type ModalBackgroundStyle = ViewStyle
export type ModalMenuStyle = ViewStyle
export type ModalCloseButtonStyle = ViewStyle

export type ModalThemeResolvers = {
  background: StyleLeaf<ModalBackgroundStyle>,
  menu: StyleLeaf<ModalMenuStyle>,
  closeButton: StyleLeaf<ModalCloseButtonStyle>,
}
