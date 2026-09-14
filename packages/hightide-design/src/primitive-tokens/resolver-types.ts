import type { ColorToken } from './color-token'
import type { NumberToken } from './number-token'

export type ResolverColorParams = {
  color?: ColorToken,
  onColor?: ColorToken,
  accent?: ColorToken,
  background?: ColorToken,
  foreground?: ColorToken,
  disabledBackground?: ColorToken,
  disabledForeground?: ColorToken,
  tint?: ColorToken,
  tintColor?: ColorToken,
}

export type ResolverState = string

export type ResolverConfig = Record<string, string>

export interface ResolverParams {
  colors?: ResolverColorParams,
  numbers?: Record<string, NumberToken>,
}
