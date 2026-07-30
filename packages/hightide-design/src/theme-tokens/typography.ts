import { hightideTypography } from '../primitive-tokens/typography'

export type HightideThemeTypographyTokens = {
  fontFamily: {
    default: string,
    accent: string,
    mono: string,
  },
  fontSize: typeof hightideTypography.fontSize,
  fontWeight: typeof hightideTypography.fontWeight,
  lineHeight: typeof hightideTypography.lineHeight,
}

export const hightideThemeTypographyTokens: HightideThemeTypographyTokens = {
  fontFamily: {
    default: hightideTypography.fontFamily.inter,
    accent: hightideTypography.fontFamily.spaceGrotesk,
    mono: hightideTypography.fontFamily.inter,
  },
  fontSize: hightideTypography.fontSize,
  fontWeight: hightideTypography.fontWeight,
  lineHeight: hightideTypography.lineHeight,
}
