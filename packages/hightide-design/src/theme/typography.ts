import type { HightideTypographyPrimitiveTokens } from '../primitive/typography'

export type HightideThemeHightideTypographyTokens = {
  fontFamily: {
    default: string,
    accent: string,
    mono: string,
  },
  fontSize: HightideTypographyPrimitiveTokens['fontSize'],
  fontWeight: HightideTypographyPrimitiveTokens['fontWeight'],
  lineHeight: HightideTypographyPrimitiveTokens['lineHeight'],
}

export const toHightideThemeTypography = (
  typography: HightideTypographyPrimitiveTokens
): HightideThemeHightideTypographyTokens => ({
  fontFamily: {
    default: typography.fontFamily.inter,
    accent: typography.fontFamily.spaceGrotesk,
    mono: typography.fontFamily.inter,
  },
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
  lineHeight: typography.lineHeight,
})
