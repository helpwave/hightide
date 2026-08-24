import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import type { StyleOverwrite, StyleResolverFunction } from '../theme'

export const useMemoizedTheme = <State, Style>(
  resolver: StyleResolverFunction<State, Style>,
  state: State,
  overwrite?: StyleOverwrite<State, Style>
): Style => {
  const memoizedTheme = useMemo(() => StyleSheet.flatten(resolver(state, overwrite)), [overwrite, resolver, state])
  return memoizedTheme as Style
}

export const useMemoizedThemeFactory = <State, Factory>(
  resolver: StyleResolverFunction<State, Factory>,
  state: State,
  overwrite?: StyleOverwrite<State, Factory>
): Factory => {
  return useMemo(
    () => resolver(state, overwrite) as Factory,
    [overwrite, resolver, state]
  )
}