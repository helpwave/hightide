import type { HexColor } from './color'

export const fontWeights = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const

export type FontWeight = typeof fontWeights[number]

export const toFontWeight = (value: unknown): FontWeight => {
  const numeric = typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  const stepped = Number.isFinite(numeric)
    ? Math.min(900, Math.max(100, Math.round(numeric / 100) * 100))
    : 400

  return String(stepped) as FontWeight
}

export type TypographyStyle = {
  fontSize: number,
  lineHeight: number,
  fontWeight: FontWeight,
  fontFamily: string,
}

export type HightideFontFamilies = {
  default: string,
  accent: string,
  mono: string,
}

export type HightideFontWeights = Record<string, FontWeight>

export type FontSizing = {
  fontSize: number,
  lineHeight: number,
}

export type HightideFontSizing = Record<string, FontSizing>

export type HightideTypography = {
  display: TypographyStyle,
  heading: Record<'sm' | 'md' | 'lg', TypographyStyle>,
  body: Record<'sm' | 'md' | 'lg', TypographyStyle>,
  label: Record<'sm' | 'md' | 'lg', TypographyStyle>,
}

export type TypographySizes = 'sm' | 'md' | 'lg'

export type { HexColor }
