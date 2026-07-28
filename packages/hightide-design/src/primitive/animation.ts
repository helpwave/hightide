export type TimeToken = `${number}ms`

export type AnimationTokens = {
  durationIn: TimeToken,
  durationOut: TimeToken,
}

export const animationTokens: AnimationTokens = {
  durationIn: '250ms',
  durationOut: '170ms',
}
