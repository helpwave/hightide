import type { ColorToken } from '../types'

const expandHex = (hex: string): string => {
  const normalized = hex.startsWith('#') ? hex.slice(1) : hex

  if (normalized.length === 3 || normalized.length === 4) {
    return normalized.split('').map((char) => char + char).join('')
  }

  return normalized
}

export const hexWithAlpha = (hex: ColorToken, alpha: number): ColorToken => {
  const expanded = expandHex(hex)
  const rgb = expanded.slice(0, 6)
  const alphaByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  const alphaHex = alphaByte.toString(16).padStart(2, '0')

  return `#${rgb}${alphaHex}`
}
