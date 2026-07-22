export type BorderRadiusToken = number | 'full'

export type BorderRadiusTokens = Record<string, BorderRadiusToken>

export type DecorationTokens = {
  borderRadius: BorderRadiusTokens,
}