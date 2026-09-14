import type { AssertAssignable } from '../utils/assert'
import type { ColorValueToken } from './color-value-token'
import type { NumberValueToken } from './number-value-token'

export type ResolverState = string

export type ResolverConfig = Record<string, string | undefined>

export interface ResolverParams {
  colors?: Record<string, ColorValueToken | undefined>,
  numbers?: Record<string, NumberValueToken | undefined>,
}

export type HightideColorParams = {
  color?: ColorValueToken,
  onColor?: ColorValueToken,
  accent?: ColorValueToken,
  background?: ColorValueToken,
  foreground?: ColorValueToken,
  disabledBackground?: ColorValueToken,
  disabledForeground?: ColorValueToken,
  tint?: ColorValueToken,
  tintColor?: ColorValueToken,
}

export type HightideResolverParams = AssertAssignable<{
  colors?: HightideColorParams,
  numbers?: Record<string, NumberValueToken | undefined>,
}, ResolverParams>