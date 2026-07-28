export type BorderRadiusToken = number | 'full'

export type BorderRadiusTokens = Record<string, BorderRadiusToken>

export type DecorationTokens = {
  borderRadius: BorderRadiusTokens,
}

export type HightideDecorationTokens = {
  borderRadius: {
    xs: BorderRadiusToken,
    sm: BorderRadiusToken,
    md: BorderRadiusToken,
    lg: BorderRadiusToken,
    xl: BorderRadiusToken,
  } & Record<string, BorderRadiusToken>,
}

export const decorationTokens = {
  borderRadius: {
    xs: 0.1,
    sm: 0.25,
    md: 0.5,
    lg: 1,
    xl: 2
  }
} as const satisfies HightideDecorationTokens
