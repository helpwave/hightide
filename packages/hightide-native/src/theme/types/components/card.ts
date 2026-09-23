import type { ViewStyle } from 'react-native'
import type { StyleLeaf } from '../resolver'

export type CardStyle = ViewStyle

export type CardThemeResolvers = {
  container: StyleLeaf<CardStyle>,
}
