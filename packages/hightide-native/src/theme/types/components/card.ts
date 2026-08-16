import type { ViewStyle } from 'react-native'

import type { SimpleStyleResolver } from '../resolver'

export type CardStyle = ViewStyle

export type CardThemeResolvers = {
  container: SimpleStyleResolver<CardStyle>,
}
