import type { ViewStyle } from 'react-native'

import type { SimpleStyleResolver } from '../resolver'

export type ModalBackgroundStyle = ViewStyle

export type ModalMenuStyle = ViewStyle

export type ModalCloseButtonStyle = ViewStyle

export type ModalThemeResolvers = {
  background: SimpleStyleResolver<ModalBackgroundStyle>,
  menu: SimpleStyleResolver<ModalMenuStyle>,
  closeButton: SimpleStyleResolver<ModalCloseButtonStyle>,
}
