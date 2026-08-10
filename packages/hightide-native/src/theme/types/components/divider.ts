import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { DividerDirection } from '@helpwave/hightide-design/component-token-resolvers'
import type { ViewStyle } from 'react-native'

import type { StyleResolverFunction } from '../resolver'

export type DividerState = {
  direction?: DividerDirection,
  color?: ColorToken,
  width?: number,
  margin?: number,
}

export type DividerStyle = ViewStyle

export type DividerThemeResolvers = {
  container: StyleResolverFunction<DividerState, DividerStyle>,
}
