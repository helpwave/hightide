import type { ScalingUnitToken } from './units'

export type BreakpointKey = 'tablet' | 'desktop'

export type BreakpointPrimitiveTokens = Record<BreakpointKey, ScalingUnitToken> & Record<string, ScalingUnitToken>

export const hightideBreakpoint = {
  tablet: 768,
  desktop: 1024,
} as const satisfies BreakpointPrimitiveTokens
