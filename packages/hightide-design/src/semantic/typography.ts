import type { FontSizeKey, FontWeightKey } from '../primitive/typography'
import { hightideTypography } from '../primitive/typography'

export type TypographyStyleToken = {
  fontSize: string,
  lineHeight: number | string,
  fontWeight: number,
  fontFamily?: string,
}

export type TypographyTokens = {
  fontWeights: typeof hightideTypography.fontWeight,
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

const createTypographyStyle = (
  size: FontSizeKey,
  weight: FontWeightKey,
  fontFamily?: string
): TypographyStyleToken => ({
  fontSize: hightideTypography.fontSize[size],
  lineHeight: hightideTypography.lineHeight[size],
  fontWeight: hightideTypography.fontWeight[weight],
  fontFamily,
})

export const typography = {
  fontWeights: hightideTypography.fontWeight,
  scales: {
    headline: {
      large: createTypographyStyle('4xl', 'bold', 'space'),
      medium: createTypographyStyle('3xl', 'semibold', 'space'),
      small: createTypographyStyle('2xl', 'bold', 'space'),
    },
    title: {
      large: createTypographyStyle('2xl', 'semibold', 'space'),
      medium: createTypographyStyle('lg', 'semibold', 'space'),
      small: createTypographyStyle('base', 'medium', 'space'),
    },
    body: {
      large: createTypographyStyle('lg', 'base'),
      medium: createTypographyStyle('base', 'base'),
    },
    label: {
      large: createTypographyStyle('base', 'semibold'),
      medium: createTypographyStyle('sm', 'medium'),
    },
    caption: {
      large: createTypographyStyle('lg', 'base'),
      medium: createTypographyStyle('base', 'medium'),
      small: createTypographyStyle('sm', 'base'),
    },
    button: {
      large: createTypographyStyle('lg', 'semibold'),
      medium: createTypographyStyle('base', 'semibold'),
      small: createTypographyStyle('sm', 'base'),
    },
  }
} as const satisfies TypographyTokens
