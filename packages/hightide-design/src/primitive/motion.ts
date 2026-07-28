export type MotionPrimitiveTokens = {
  duration: Record<string, string>,
}

export const hightideMotion = {
  duration: {
    in: '250ms',
    out: '170ms',
  },
} as const satisfies MotionPrimitiveTokens
