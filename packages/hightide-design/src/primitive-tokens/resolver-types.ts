import type { AxisFlow, WritingOrientation } from '../utils'
import type { AssertAssignable } from '../utils/assert'
import type { ColorValueToken } from './color-value-token'
import type { NumberValueToken } from './number-value-token'

export type ResolverConfig = Record<string, string | true | false | undefined>

export type ResolverRuntimeConfig = Record<string, string | undefined>

export type ResolverState = string

export interface ResolverParams {
  colors?: Record<string, ColorValueToken | undefined>,
  numbers?: Record<string, NumberValueToken | undefined>,
}

export type HightideResolverConfig<ConfigAddition = Record<string, string | true | false | undefined>> = AssertAssignable<ConfigAddition & {
  'writing-orientation'?: WritingOrientation,
  'writing-inline'?: AxisFlow,
  'writing-block'?: AxisFlow,
}, ResolverConfig>

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
