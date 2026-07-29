import type { TypographyPrimitiveTokens } from '../primitive/typography'

export type ThemeTypographyTokens = {
  fontFamily: {
    default: string,
    accent: string,
    mono: string,
  },
  fontSize: TypographyPrimitiveTokens['fontSize'],
  fontWeight: TypographyPrimitiveTokens['fontWeight'],
  lineHeight: TypographyPrimitiveTokens['lineHeight'],
}

export const toHightideThemeTypography = (
  typography: TypographyPrimitiveTokens
): ThemeTypographyTokens => ({
  fontFamily: {
    default: typography.fontFamily.inter,
    accent: typography.fontFamily.spaceGrotesk,
    mono: typography.fontFamily.inter,
  },
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
  lineHeight: typography.lineHeight,
})
