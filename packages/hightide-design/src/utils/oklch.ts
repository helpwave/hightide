import type { HexColorToken } from '../primitive-tokens'

export interface OKLab {
  l: number,
  a: number,
  b: number,
}

export interface OKLCH {
  l: number, // 0..1
  c: number, // usually ~0..0.4
  h: number, // degrees, 0..360
}

/**
 * Convert sRGB channel [0..255] to linear RGB [0..1].
 */
function srgbToLinear(value: number): number {
  const v = value / 255

  return v <= 0.04045
    ? v / 12.92
    : Math.pow((v + 0.055) / 1.055, 2.4)
}

/**
 * Convert linear RGB [0..1] to sRGB channel [0..255].
 */
function linearToSrgb(value: number): number {
  const v = Math.max(0, Math.min(1, value))

  return (
    255 *
    (v <= 0.0031308
      ? 12.92 * v
      : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)
  )
}

/**
 * Hex -> OKLab
 */
export function hexToOKLab(hex: HexColorToken): OKLab {
  const clean = hex.replace(/^#/, '')

  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  const r = srgbToLinear(parseInt(clean.slice(0, 2), 16))
  const g = srgbToLinear(parseInt(clean.slice(2, 4), 16))
  const b = srgbToLinear(parseInt(clean.slice(4, 6), 16))

  // Linear sRGB -> LMS
  const l =
    0.4122214708 * r +
    0.5363325363 * g +
    0.0514459929 * b

  const m =
    0.2119034982 * r +
    0.6806995451 * g +
    0.1073969566 * b

  const s =
    0.0883024619 * r +
    0.2817188376 * g +
    0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    l:
      0.2104542553 * l_ +
      0.793617785 * m_ -
      0.0040720468 * s_,

    a:
      1.9779984951 * l_ -
      2.428592205 * m_ +
      0.4505937099 * s_,

    b:
      0.0259040371 * l_ +
      0.7827717662 * m_ -
      0.808675766 * s_,
  }
}

/**
 * OKLab -> linear RGB
 */
function oklabToLinearRGB({ l, a, b }: OKLab) {
  const l_ =
    l + 0.3963377774 * a + 0.2158037573 * b

  const m_ =
    l - 0.1055613458 * a - 0.0638541728 * b

  const s_ =
    l - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3

  return {
    r:
      +4.0767416621 * l3 -
      3.3077115913 * m3 +
      0.2309699292 * s3,

    g:
      -1.2684380046 * l3 +
      2.6097574011 * m3 -
      0.3413193965 * s3,

    b:
      -0.0041960863 * l3 -
      0.7034186147 * m3 +
      1.707614701 * s3,
  }
}

/**
 * OKLab -> Hex
 */
export function oklabToHex(lab: OKLab): HexColorToken {
  const rgb = oklabToLinearRGB(lab)

  const r = Math.round(linearToSrgb(rgb.r))
  const g = Math.round(linearToSrgb(rgb.g))
  const b = Math.round(linearToSrgb(rgb.b))

  const rgbHex = [r, g, b]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')

  return `#${rgbHex}`
}

/**
 * OKLab -> OKLCH
 */
export function oklabToOKLCH({ l, a, b }: OKLab): OKLCH {
  const c = Math.sqrt(a * a + b * b)

  let h = Math.atan2(b, a) * (180 / Math.PI)

  if (h < 0) {
    h += 360
  }

  return { l, c, h }
}

/**
 * OKLCH -> OKLab
 */
export function oklchToOKLab({ l, c, h }: OKLCH): OKLab {
  const radians = h * (Math.PI / 180)

  return {
    l,
    a: c * Math.cos(radians),
    b: c * Math.sin(radians),
  }
}

/**
 * Hex -> OKLCH
 */
export function hexToOKLCH(hex: HexColorToken): OKLCH {
  return oklabToOKLCH(hexToOKLab(hex))
}

/**
 * OKLCH -> Hex
 */
export function oklchToHex(lch: OKLCH): HexColorToken {
  return oklabToHex(oklchToOKLab(lch))
}

/**
 * Increase/decrease perceptual lightness.
 *
 * `amount` is in OKLCH's 0..1 lightness scale.
 *
 * Example:
 *   increaseLightness("#336699", 0.1)
 */
function changeLightness(
  hex: HexColorToken,
  value: number
): HexColorToken {
  const lch = hexToOKLCH(hex)

  return oklchToHex({
    ...lch,
    l: Math.max(0, Math.min(1, value)),
  })
}

export const OKLCHUtils = {
  changeLightness,
  hexToOKLCH,
  oklchToHex
}