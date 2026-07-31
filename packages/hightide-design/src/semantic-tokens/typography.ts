import type { FontSizeKey, FontWeightKey } from '../primitive-tokens/typography'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'

export type HightideTypographyStyleToken = {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily: string,
}

export const typographySizes = ['sm', 'md', 'lg'] as const
export type TypographySizes = typeof typographySizes[number]

export type SemanticFontWeightTokens = {
  thin: number,
  light: number,
  base: number,
  medium: number,
  semibold: number,
  bold: number,
}

export type SemanticFontFamilies = {
  default: string,
  accent: string,
  mono: string,
}

export type HightideSemanticTypographyTokens = {
  fontWeights: SemanticFontWeightTokens,
  fontFamilies: SemanticFontFamilies,
  display: HightideTypographyStyleToken,
  heading: Record<TypographySizes, HightideTypographyStyleToken>,
  body: Record<TypographySizes, HightideTypographyStyleToken>,
  label: Record<TypographySizes, HightideTypographyStyleToken>,
}

export const createTypographyStyle = (
  typography: HightideThemeTokens['typography'],
  size: FontSizeKey,
  weight: FontWeightKey,
  fontFamily: string
): HightideTypographyStyleToken => ({
  fontSize: typography.fontSize[size],
  lineHeight: typography.lineHeight[size],
  fontWeight: typography.fontWeight[weight],
  fontFamily,
})

export const createHightideTypographyTokens = (
  themeTokens: HightideThemeTokens
): HightideSemanticTypographyTokens => {
  const { typography } = themeTokens
  const { fontFamily, fontWeight } = typography

  return {
    fontWeights: {
      thin: fontWeight.thin,
      light: fontWeight.light,
      base: fontWeight.base,
      medium: fontWeight.medium,
      semibold: fontWeight.semibold,
      bold: fontWeight.bold,
    },
    fontFamilies: {
      default: fontFamily.default,
      accent: fontFamily.accent,
      mono: fontFamily.mono,
    },
    display: createTypographyStyle(typography, '4xl', 'bold', fontFamily.accent),
    heading: {
      lg: createTypographyStyle(typography, '2xl', 'semibold', fontFamily.accent),
      md: createTypographyStyle(typography, 'lg', 'semibold', fontFamily.accent),
      sm: createTypographyStyle(typography, 'base', 'medium', fontFamily.accent),
    },
    body: {
      lg: createTypographyStyle(typography, 'lg', 'base', fontFamily.default),
      md: createTypographyStyle(typography, 'base', 'base', fontFamily.default),
      sm: createTypographyStyle(typography, 'sm', 'base', fontFamily.default),
    },
    label: {
      lg: createTypographyStyle(typography, 'lg', 'semibold', fontFamily.default),
      md: createTypographyStyle(typography, 'base', 'semibold', fontFamily.default),
      sm: createTypographyStyle(typography, 'sm', 'medium', fontFamily.default),
    },
  }
}
