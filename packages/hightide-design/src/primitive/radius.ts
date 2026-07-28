export type RadiusSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type RadiusPrimitiveTokens = Record<RadiusSize, string> & Record<string, string>

export const hightideRadius = {
  xs: '2',
  sm: '4',
  md: '8',
  lg: '16',
  xl: '32',
} as const satisfies RadiusPrimitiveTokens
