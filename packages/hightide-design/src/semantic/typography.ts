import type { FontSizeKey, FontWeightKey } from '../primitive/typography'
import type { HightideThemeTokens } from '../theme/themeTokens'

export type HightideTypographyStyleToken = {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily?: string,
}

export type HightideTypographyTokens = {
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

export type { HightideTypographyTokens as TypographyScale, HightideTypographyStyleToken as TypographyStyle }

export const createTypographyStyle = (
  typography: HightideThemeTokens['typography'],
  size: FontSizeKey,
  weight: FontWeightKey,
  fontFamily?: string
): HightideTypographyStyleToken => ({
  fontSize: typography.fontSize[size],
  lineHeight: typography.lineHeight[size],
  fontWeight: typography.fontWeight[weight],
  fontFamily,
})

export const createHightideTypographyTokens = (
  typography: HightideThemeTokens['typography']
): HightideTypographyTokens => ({
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
      large: createTypographyStyle(typography, 'lg', 'base'),
      medium: createTypographyStyle(typography, 'base', 'base'),
    },
    label: {
      large: createTypographyStyle(typography, 'base', 'semibold'),
      medium: createTypographyStyle(typography, 'sm', 'medium'),
    },
    caption: {
      large: createTypographyStyle(typography, 'lg', 'base'),
      medium: createTypographyStyle(typography, 'base', 'medium'),
      small: createTypographyStyle(typography, 'sm', 'base'),
    },
    button: {
      large: createTypographyStyle(typography, 'lg', 'semibold'),
      medium: createTypographyStyle(typography, 'base', 'semibold'),
      small: createTypographyStyle(typography, 'sm', 'base'),
    },
  },
})
