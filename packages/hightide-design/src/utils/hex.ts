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

const parseRgb = (hex: HexColorToken): [number, number, number] => {
  const expanded = expandHex(hex).slice(0, 6)
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ]
}

const toHex = (r: number, g: number, b: number): HexColorToken => {
  const channel = (value: number) => Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
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

const blendOver = (base: HexColorToken, overlay: HexColorToken, alpha: number): HexColorToken => {
  const [br, bg, bb] = parseRgb(base)
  const [or, og, ob] = parseRgb(overlay)
  const t = Math.min(1, Math.max(0, alpha))
  return toHex(
    br * (1 - t) + or * t,
    bg * (1 - t) + og * t,
    bb * (1 - t) + ob * t
  )
}

export const HexColorUtils = {
  hexWithAlpha,
  mixWithBlack,
  mixWithWhite,
  blendOver,
}
