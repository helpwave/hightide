import type { HexColorToken } from '../primitive-tokens/color'

const expandHex = (hex: string): string => {
  const normalized = hex.startsWith('#') ? hex.slice(1) : hex

  if (normalized.length === 3 || normalized.length === 4) {
    return normalized.split('').map((char) => char + char).join('')
  }

  return normalized
}

const hexWithAlpha = (hex: HexColorToken, alpha: number): HexColorToken => {
  const expanded = expandHex(hex)
  const rgb = expanded.slice(0, 6)
  const alphaByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  const alphaHex = alphaByte.toString(16).padStart(2, '0')

  return `#${rgb}${alphaHex}`
}

const parseRgba = (hex: HexColorToken): [number, number, number, number] => {
  const expanded = expandHex(hex)
  const rgb = expanded.slice(0, 6)
  const hasAlpha = expanded.length >= 8
  const alphaHex = hasAlpha ? expanded.slice(6, 8) : 'ff'

  return [
    Number.parseInt(rgb.slice(0, 2), 16),
    Number.parseInt(rgb.slice(2, 4), 16),
    Number.parseInt(rgb.slice(4, 6), 16),
    Number.parseInt(alphaHex, 16) / 255,
  ]
}

const parseRgb = (hex: HexColorToken): [number, number, number] => {
  const [r, g, b] = parseRgba(hex)
  return [r, g, b]
}

const channelHex = (value: number): string => Math.round(Math.min(255, Math.max(0, value)))
  .toString(16)
  .padStart(2, '0')

const toHex = (r: number, g: number, b: number): HexColorToken => (
  `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`
)

const toHexWithAlpha = (r: number, g: number, b: number, alpha: number): HexColorToken => {
  const alphaByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}${alphaByte.toString(16).padStart(2, '0')}`
}

const mixWithBlack = (hex: HexColorToken, amount: number): HexColorToken => {
  const [r, g, b] = parseRgb(hex)
  const factor = 1 - Math.min(1, Math.max(0, amount))
  return toHex(r * factor, g * factor, b * factor)
}

const mixWithWhite = (hex: HexColorToken, amount: number): HexColorToken => {
  const [r, g, b] = parseRgb(hex)
  const t = Math.min(1, Math.max(0, amount))
  return toHex(
    r + (255 - r) * t,
    g + (255 - g) * t,
    b + (255 - b) * t
  )
}

const blend = (background: HexColorToken, tint: HexColorToken): HexColorToken => {
  const [br, bg, bb, ba] = parseRgba(background)
  const [tr, tg, tb, ta] = parseRgba(tint)
  const outA = ta + ba * (1 - ta)

  if (outA <= 0) {
    return '#00000000'
  }

  const outR = (tr * ta + br * ba * (1 - ta)) / outA
  const outG = (tg * ta + bg * ba * (1 - ta)) / outA
  const outB = (tb * ta + bb * ba * (1 - ta)) / outA

  if (outA >= 1) {
    return toHex(outR, outG, outB)
  }

  return toHexWithAlpha(outR, outG, outB, outA)
}

export const HexColorUtils = {
  hexWithAlpha,
  mixWithBlack,
  mixWithWhite,
  blend,
}
