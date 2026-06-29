/**
 * Typography tokens for the helpwave design language.
 *
 * Transcribed from the web library's `theme/typography.css`. Font sizes and
 * line heights are stored in **pixels** (the CSS uses `rem` based on a 16px
 * root) which is the unit React Native works in natively.
 */

export const fontFamilies = {
  /** Body / default font. */
  sans: 'Inter',
  /** Display / heading font. */
  display: 'Space Grotesk',
} as const

export type FontFamilyName = keyof typeof fontFamilies

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export type FontWeightName = keyof typeof fontWeights

/** Font sizes in px, paired with their line heights (also px). */
export const fontSizes = {
  xs: { fontSize: 12, lineHeight: 15 },
  sm: { fontSize: 14, lineHeight: 17 },
  base: { fontSize: 16, lineHeight: 19 },
  lg: { fontSize: 18, lineHeight: 23 },
  xl: { fontSize: 20, lineHeight: 26 },
  '2xl': { fontSize: 22, lineHeight: 28 },
  '3xl': { fontSize: 24, lineHeight: 30 },
  '4xl': { fontSize: 32, lineHeight: 40 },
  '5xl': { fontSize: 48, lineHeight: 48 },
  '6xl': { fontSize: 60, lineHeight: 60 },
  '7xl': { fontSize: 72, lineHeight: 72 },
  '8xl': { fontSize: 96, lineHeight: 96 },
  '9xl': { fontSize: 128, lineHeight: 128 },
} as const

export type FontSizeName = keyof typeof fontSizes

export type TypographyVariant = {
  fontSize: number,
  lineHeight: number,
  fontWeight: (typeof fontWeights)[FontWeightName],
  fontFamily: (typeof fontFamilies)[FontFamilyName],
}

const variant = (
  size: FontSizeName,
  weight: FontWeightName,
  family: FontFamilyName = 'sans',
): TypographyVariant => ({
  fontSize: fontSizes[size].fontSize,
  lineHeight: fontSizes[size].lineHeight,
  fontWeight: fontWeights[weight],
  fontFamily: fontFamilies[family],
})

/**
 * The named typographic roles, mirroring the `typography-*` utilities on web.
 * Keys use the `<role><Size>` convention (e.g. `titleMd`, `bodyLg`).
 */
export const typography = {
  headlineLg: variant('4xl', 'bold', 'display'),
  headlineMd: variant('3xl', 'semibold', 'display'),
  headline: variant('2xl', 'bold', 'display'),

  titleLg: variant('2xl', 'semibold', 'display'),
  titleMd: variant('lg', 'semibold', 'display'),
  titleSm: variant('base', 'medium', 'display'),

  bodyLg: variant('lg', 'normal'),
  bodyMd: variant('base', 'normal'),

  labelLg: variant('base', 'semibold'),
  labelMd: variant('sm', 'medium'),

  captionLg: variant('lg', 'normal'),
  captionMd: variant('base', 'medium'),
  captionSm: variant('sm', 'normal'),

  buttonLg: variant('lg', 'semibold'),
  buttonMd: variant('base', 'semibold'),
  buttonSm: variant('sm', 'normal'),
} as const

export type TypographyVariantName = keyof typeof typography
