import { useMemo } from 'react'
import { StyleSheet, type StyleProp } from 'react-native'
import type { StyleLeaf, StyleOverwrite } from '../theme/types/resolver'
import type { TokenContextInput } from '../theme/token-context'

export const useMemoizedTheme = <TStyle, _State = never>(
  leaf: StyleLeaf<TStyle>,
  context: TokenContextInput,
  overwrite?: StyleOverwrite<TStyle>
): TStyle => {
  return useMemo(() => {
    const resolved = leaf(context)
    if (overwrite === undefined) {
      return StyleSheet.flatten(resolved) as TStyle
    }
    if (typeof overwrite === 'function') {
      const next = (overwrite as (context: TokenContextInput, prev: TStyle) => StyleProp<TStyle>)(context, resolved)
      return StyleSheet.flatten(next) as TStyle
    }
    return StyleSheet.flatten([resolved, overwrite]) as TStyle
  }, [context, leaf, overwrite])
}
