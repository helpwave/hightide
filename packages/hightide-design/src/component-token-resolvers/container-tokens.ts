import type { ColorToken } from '../primitive-tokens/color'

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
}
