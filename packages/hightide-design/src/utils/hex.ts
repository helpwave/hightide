import type { ColorToken } from '../primitive-tokens/color'

const expandHex = (hex: string): string => {
  const normalized = hex.startsWith('#') ? hex.slice(1) : hex

  if (normalized.length === 3 || normalized.length === 4) {
    return normalized.split('').map((char) => char + char).join('')
  }

  return normalized
}

const hexWithAlpha = (hex: ColorToken, alpha: number): ColorToken => {
  const expanded = expandHex(hex)
  const rgb = expanded.slice(0, 6)
  const alphaByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  const alphaHex = alphaByte.toString(16).padStart(2, '0')

  return `#${rgb}${alphaHex}`
}

const parseRgb = (hex: ColorToken): [number, number, number] => {
  const expanded = expandHex(hex).slice(0, 6)
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ]
}

const toHex = (r: number, g: number, b: number): ColorToken => {
  const channel = (value: number) => Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

const mixWithBlack = (hex: ColorToken, amount: number): ColorToken => {
  const [r, g, b] = parseRgb(hex)
  const factor = 1 - Math.min(1, Math.max(0, amount))
  return toHex(r * factor, g * factor, b * factor)
}

const mixWithWhite = (hex: ColorToken, amount: number): ColorToken => {
  const [r, g, b] = parseRgb(hex)
  const t = Math.min(1, Math.max(0, amount))
  return toHex(
    r + (255 - r) * t,
    g + (255 - g) * t,
    b + (255 - b) * t
  )
}

export const HexColorUtils = {
  hexWithAlpha,
  mixWithBlack,
  mixWithWhite,
}
