import { useMemo } from 'react'
import type { StyleResolverFunction } from '../theme'
import { StyleSheet, type StyleProp } from 'react-native'

export const useMemoizedTheme = <State, Style>(
  resolver: StyleResolverFunction<State, Style>,
  state: State,
  overwrite?: StyleProp<Style> | ((state: State, prev: Style) => StyleProp<Style>)
): Style => {
  const memoizedTheme = useMemo(() => StyleSheet.flatten(resolver(state, overwrite)), [overwrite, resolver, state])
  return memoizedTheme as Style
}