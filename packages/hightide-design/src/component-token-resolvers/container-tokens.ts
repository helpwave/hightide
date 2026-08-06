import type { ColorToken } from '../primitive-tokens/color'
import type { ShadowToken } from '../theme-tokens/theme-tokens'

export type ContainerTokens = {
  backgroundColor?: ColorToken,
  border?: {
    width?: number,
    color?: ColorToken,
  },
  size?: {
    height?: number,
    width?: number,
    minHeight?: number,
    minWidth?: number,
    maxHeight?: number,
    maxWidth?: number,
  },
  shape?: {
    borderRadius?: number,
    padding?: {
      vertical?: number,
      horizontal?: number,
    },
  },
  layout?: {
    gap?: number,
  },
  decoration?: {
    shadow?: ShadowToken,
  },
  outline?: {
    width?: number,
    offset?: number,
    color?: ColorToken,
  },
}
