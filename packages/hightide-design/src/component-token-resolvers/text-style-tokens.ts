import type { ColorToken } from '../primitive-tokens/color'
import type { TypographyStyleToken } from '../theme-tokens/typography-style-token'

export type TextStyleTokens = TypographyStyleToken & {
  color: ColorToken,
}
