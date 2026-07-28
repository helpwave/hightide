import { fontSizes } from '../primitive/typography/font-sizes'
import { fontWeights } from '../primitive/typography/font-weights'
import { lineHeights } from '../primitive/typography/line-heights'
import type {
  FontFamilyToken,
  FontWeightToken,
  FontWeightVariableTokens
} from '../primitive/typography/font-weight'

export type TypographyStyleToken = {
  fontSize: number,
  lineHeight: number,
  fontWeight: FontWeightToken,
  fontFamily?: string,
}

export type TypographyTokens = {
  fontWeights: FontWeightVariableTokens,
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
  size: keyof typeof fontSizes,
  weight: keyof typeof fontWeights,
  fontFamily?: FontFamilyToken
): TypographyStyleToken => ({
  fontSize: fontSizes[size],
  lineHeight: lineHeights[size],
  fontWeight: fontWeights[weight],
  fontFamily
})

export const typography = {
  fontWeights,
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
