export const lineHeights = {
  'xs': 15,
  'sm': 17,
  'base': 19,
  'lg': 23,
  'xl': 26,
  '2xl': 28,
  '3xl': 30,
  '4xl': 40,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const

export type LineHeightToken = keyof typeof lineHeights
