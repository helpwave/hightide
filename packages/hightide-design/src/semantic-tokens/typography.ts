import type { FontSizeKey, FontWeightKey } from '../primitive-tokens/typography'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'

export type HightideTypographyStyleToken = {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily: string,
}

export type HightideSemanticTypographyTokens = {
  fontWeights: HightideThemeTokens['typography']['fontWeight'],
  scales: {
    headline: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
      small: HightideTypographyStyleToken,
    },
    title: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
      small: HightideTypographyStyleToken,
    },
    body: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
    },
    label: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
    },
    caption: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
      small: HightideTypographyStyleToken,
    },
    button: {
      large: HightideTypographyStyleToken,
      medium: HightideTypographyStyleToken,
      small: HightideTypographyStyleToken,
    },
  },
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
  return ({
    fontWeights: typography.fontWeight,
    scales: {
      headline: {
        large: createTypographyStyle(typography, '4xl', 'bold', typography.fontFamily.accent),
        medium: createTypographyStyle(typography, '3xl', 'semibold', typography.fontFamily.accent),
        small: createTypographyStyle(typography, '2xl', 'bold', typography.fontFamily.accent),
      },
      title: {
        large: createTypographyStyle(typography, '2xl', 'semibold', typography.fontFamily.accent),
        medium: createTypographyStyle(typography, 'lg', 'semibold', typography.fontFamily.accent),
        small: createTypographyStyle(typography, 'base', 'medium', typography.fontFamily.accent),
      },
      body: {
        large: createTypographyStyle(typography, 'lg', 'base', typography.fontFamily.default),
        medium: createTypographyStyle(typography, 'base', 'base', typography.fontFamily.default),
      },
      label: {
        large: createTypographyStyle(typography, 'base', 'semibold', typography.fontFamily.default),
        medium: createTypographyStyle(typography, 'sm', 'medium', typography.fontFamily.default),
      },
      caption: {
        large: createTypographyStyle(typography, 'lg', 'base', typography.fontFamily.default),
        medium: createTypographyStyle(typography, 'base', 'medium', typography.fontFamily.default),
        small: createTypographyStyle(typography, 'sm', 'base', typography.fontFamily.default),
      },
      button: {
        large: createTypographyStyle(typography, 'lg', 'semibold', typography.fontFamily.default),
        medium: createTypographyStyle(typography, 'base', 'semibold', typography.fontFamily.default),
        small: createTypographyStyle(typography, 'sm', 'base', typography.fontFamily.default),
      },
    },
  })
}
