import type { FixedUnitToken, ScalingUnitToken } from './units'

export type ElementSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ElementToken = {
  size: ScalingUnitToken,
  inset: ScalingUnitToken,
  border: FixedUnitToken,
}

export type ElementPrimitiveTokens = Record<ElementSize, ElementToken> & Record<string, ElementToken>

export const hightideElements = {
  xs: { size: 28, inset: 6, border: 2 },
  sm: { size: 36, inset: 6, border: 2 },
  md: { size: 44, inset: 10, border: 2 },
  lg: { size: 52, inset: 10, border: 2 },
  xl: { size: 60, inset: 12, border: 2 },
} as const satisfies ElementPrimitiveTokens
