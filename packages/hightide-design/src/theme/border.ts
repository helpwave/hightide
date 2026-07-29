import type { BorderPrimitiveTokens } from '../primitive/border'
import type { FixedUnitToken } from '../primitive/units'

export type BorderWidthKey = 'thin' | 'base' | 'thick'

export type BorderTokens = Record<BorderWidthKey, FixedUnitToken>

export const toHightideThemeBorder = (
  border: BorderPrimitiveTokens
): BorderTokens => ({
  thin: border[1],
  base: border[2],
  thick: border[4],
})
