import type { FixedUnitToken } from './units'

export type BorderWidthKey = 'thin' | 'base' | 'thick'

export type BorderPrimitiveTokens = Record<BorderWidthKey, FixedUnitToken> & Record<string, FixedUnitToken>

export const hightideBorder = {
  thin: 1,
  base: 2,
  thick: 4,
} as const satisfies BorderPrimitiveTokens
