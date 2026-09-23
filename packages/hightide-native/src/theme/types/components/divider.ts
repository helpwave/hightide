import type { ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'

export type DividerState = TokenContextInput

export type DividerStyle = ViewStyle

export type DividerThemeResolvers = {
  container: StyleLeaf<DividerStyle>,
}
