import type { FontWeightVariableTokens } from '@/src/types'

export const fontWeights = {
  thin: '100',
  light: '300',
  base: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies FontWeightVariableTokens
