export const fontSizes = {
  'xs': 12,
  'sm': 14,
  'base': 16,
  'lg': 18,
  'xl': 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 32,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const

export type FontSizeToken = keyof typeof fontSizes
