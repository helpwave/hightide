import type { ColorToken } from '../color-token'
import type { ShadowLayoutToken } from '../shadow-layout-token'
import { TokenBuilder } from '../../utils'

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

export type HightideShadowPrimitiveTokens = {
  layout: Record<string, unknown> & {
    around: Record<ShadowSizeKey, ShadowLayoutToken>,
    bottom: Record<ShadowSizeKey, ShadowLayoutToken>,
  },
  colors: Record<string, ColorToken> & Record<ShadowOpacityKey, ColorToken>,
} & Record<string, unknown>

export const hightideShadow = {
  layout: {
    basic: {
      xs: { x: TokenBuilder.number(0), y: TokenBuilder.number(0), blur: TokenBuilder.number(2), spread: TokenBuilder.number(0) },
      sm: { x: TokenBuilder.number(0), y: TokenBuilder.number(0), blur: TokenBuilder.number(3), spread: TokenBuilder.number(0) },
      md: { x: TokenBuilder.number(0), y: TokenBuilder.number(0), blur: TokenBuilder.number(5), spread: TokenBuilder.number(0) },
      lg: { x: TokenBuilder.number(0), y: TokenBuilder.number(0), blur: TokenBuilder.number(10), spread: TokenBuilder.number(0) },
      xl: { x: TokenBuilder.number(0), y: TokenBuilder.number(0), blur: TokenBuilder.number(20), spread: TokenBuilder.number(0) },
    },
    around: {
      xs: { x: TokenBuilder.number(2), y: TokenBuilder.number(2), blur: TokenBuilder.number(2), spread: TokenBuilder.number(0) },
      sm: { x: TokenBuilder.number(3), y: TokenBuilder.number(3), blur: TokenBuilder.number(3), spread: TokenBuilder.number(0) },
      md: { x: TokenBuilder.number(5), y: TokenBuilder.number(5), blur: TokenBuilder.number(5), spread: TokenBuilder.number(0) },
      lg: { x: TokenBuilder.number(10), y: TokenBuilder.number(10), blur: TokenBuilder.number(10), spread: TokenBuilder.number(0) },
      xl: { x: TokenBuilder.number(20), y: TokenBuilder.number(20), blur: TokenBuilder.number(20), spread: TokenBuilder.number(0) },
    },
    bottom: {
      xs: { x: TokenBuilder.number(0), y: TokenBuilder.number(1), blur: TokenBuilder.number(16), spread: TokenBuilder.number(0) },
      sm: { x: TokenBuilder.number(0), y: TokenBuilder.number(1), blur: TokenBuilder.number(20), spread: TokenBuilder.number(0) },
      md: { x: TokenBuilder.number(0), y: TokenBuilder.number(1), blur: TokenBuilder.number(20), spread: TokenBuilder.number(0) },
      lg: { x: TokenBuilder.number(0), y: TokenBuilder.number(2), blur: TokenBuilder.number(24), spread: TokenBuilder.number(0) },
      xl: { x: TokenBuilder.number(0), y: TokenBuilder.number(2), blur: TokenBuilder.number(24), spread: TokenBuilder.number(0) },
    },
  },
  colors: {
    '1%': TokenBuilder.color('#00000003'),
    '2%': TokenBuilder.color('#00000005'),
    '3%': TokenBuilder.color('#00000008'),
    '4%': TokenBuilder.color('#0000000a'),
    '5%': TokenBuilder.color('#0000000d'),
    '6%': TokenBuilder.color('#0000000f'),
    '7%': TokenBuilder.color('#00000012'),
    '8%': TokenBuilder.color('#00000014'),
    '9%': TokenBuilder.color('#00000017'),
    '10%': TokenBuilder.color('#0000001a'),
  },
} as const satisfies HightideShadowPrimitiveTokens
