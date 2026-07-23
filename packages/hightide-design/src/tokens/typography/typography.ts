import { fontSizes } from './font-sizes'
import { fontWeights } from './font-weights'
import { lineHeights } from './line-heights'
import type {
  FontFamilyToken,
  TypographyTokens,
  TypographyStyleToken
} from '../../types/typography'

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
