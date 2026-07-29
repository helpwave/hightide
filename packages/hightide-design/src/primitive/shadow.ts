import type { ColorToken } from './color'
import type { ScalingUnitToken } from './units'

export type ShadowLayoutToken = {
  x: ScalingUnitToken,
  y: ScalingUnitToken,
  blur: ScalingUnitToken,
  spread: ScalingUnitToken,
}

export type ShadowSizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ShadowOpacityKey =
  | '1%'
  | '2%'
  | '3%'
  | '4%'
  | '5%'
  | '6%'
  | '7%'
  | '8%'
  | '9%'
  | '10%'

export type ShadowPrimitiveTokens = {
  layout: Record<string, unknown> & {
    around: Record<ShadowSizeKey, ShadowLayoutToken>,
    bottom: Record<ShadowSizeKey, ShadowLayoutToken>,
  },
  colors: Record<string, ColorToken> & Record<ShadowOpacityKey, ColorToken>,
} & Record<string, unknown>

export const hightideShadow = {
  layout: {
    around: {
      xs: { x: 2, y: 2, blur: 2, spread: 0 },
      sm: { x: 3, y: 3, blur: 3, spread: 0 },
      md: { x: 5, y: 5, blur: 5, spread: 0 },
      lg: { x: 10, y: 10, blur: 10, spread: 0 },
      xl: { x: 20, y: 20, blur: 20, spread: 0 },
    },
    bottom: {
      xs: { x: 0, y: 1, blur: 8, spread: 0 },
      sm: { x: 0, y: 1, blur: 12, spread: 0 },
      md: { x: 0, y: 1, blur: 20, spread: 0 },
      lg: { x: 0, y: 2, blur: 28, spread: 0 },
      xl: { x: 0, y: 4, blur: 40, spread: 0 },
    },
  },
  colors: {
    '1%': '#00000003',
    '2%': '#00000005',
    '3%': '#00000008',
    '4%': '#0000000a',
    '5%': '#0000000d',
    '6%': '#0000000f',
    '7%': '#00000012',
    '8%': '#00000014',
    '9%': '#00000017',
    '10%': '#0000001a',
  },
} as const satisfies ShadowPrimitiveTokens
