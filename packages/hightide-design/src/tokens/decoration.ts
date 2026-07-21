import type { DecorationTokens } from '../types/decoration'

export const decorationTokens = {
  borderRadius: {
    xs: 0.1,
    sm: 0.25,
    md: 0.5,
    lg: 1,
    xl: 2
  }
} as const satisfies DecorationTokens