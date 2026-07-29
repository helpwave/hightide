import type { FontSizeKey, FontWeightKey } from '../primitive/typography'
import type { ThemeTokens } from '../theme/theme-tokens'

export type TypographyStyleToken = {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily?: string,
}

export type TypographyTokens = {
  fontWeights: ThemeTokens['typography']['fontWeight'],
  scales: {
    headline: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
    title: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
    body: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
    },
    label: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
    },
    caption: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
    button: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
  },
}

export type { TypographyTokens as TypographyScale, TypographyStyleToken as TypographyStyle }

export const createTypographyStyle = (
  typography: ThemeTokens['typography'],
  size: FontSizeKey,
  weight: FontWeightKey,
  fontFamily?: string
): TypographyStyleToken => ({
  fontSize: typography.fontSize[size],
  lineHeight: typography.lineHeight[size],
  fontWeight: typography.fontWeight[weight],
  fontFamily,
})

export const createTypographyTokens = (
  typography: ThemeTokens['typography']
): TypographyTokens => ({
  fontWeights: typography.fontWeight,
  scales: {
    headline: {
      large: createTypographyStyle(typography, '4xl', 'bold', typography.fontFamily.space ?? 'space'),
      medium: createTypographyStyle(typography, '3xl', 'semibold', typography.fontFamily.space ?? 'space'),
      small: createTypographyStyle(typography, '2xl', 'bold', typography.fontFamily.space ?? 'space'),
    },
    title: {
      large: createTypographyStyle(typography, '2xl', 'semibold', typography.fontFamily.space ?? 'space'),
      medium: createTypographyStyle(typography, 'lg', 'semibold', typography.fontFamily.space ?? 'space'),
      small: createTypographyStyle(typography, 'base', 'medium', typography.fontFamily.space ?? 'space'),
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
