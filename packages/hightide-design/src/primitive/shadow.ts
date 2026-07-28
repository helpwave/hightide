import type { ScalingUnitToken } from './units'

export type ShadowLayoutToken = {
  x: ScalingUnitToken,
  y: ScalingUnitToken,
  blur: ScalingUnitToken,
  spread: ScalingUnitToken,
}

export type ShadowPrimitiveTokens = Record<string, ShadowLayoutToken>

export const hightideShadow = {
  elevation: {
    x: 0,
    y: 1,
    blur: 20,
    spread: 0,
  },
  overlay: {
    x: 0,
    y: 4,
    blur: 16,
    spread: 0,
  },
  avatar: {
    x: 4,
    y: 0,
    blur: 4,
    spread: 0,
  },
} as const satisfies ShadowPrimitiveTokens
