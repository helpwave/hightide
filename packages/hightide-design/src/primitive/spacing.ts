import type { ScalingUnitToken } from './units'

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SpacingPrimitiveTokens = Record<SpacingSize, ScalingUnitToken> & Record<string, ScalingUnitToken>

export const hightideSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const satisfies SpacingPrimitiveTokens
