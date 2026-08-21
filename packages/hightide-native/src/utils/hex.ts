import { processColor, type ColorValue } from 'react-native'

import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils as DesignHexColorUtils } from '@helpwave/hightide-design/utils'

const clampByte = (value: number): number => Math.round(Math.min(255, Math.max(0, value)))

const channelHex = (value: number): string => clampByte(value).toString(16).padStart(2, '0')

const toHex = (r: number, g: number, b: number, alpha: number = 1): HexColorToken => {
  if (alpha >= 1) {
    return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`
  }

  return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}${channelHex(alpha * 255)}`
}

const argbNumberToHex = (argb: number): HexColorToken => {
  const unsigned = argb >>> 0
  const alpha = ((unsigned >>> 24) & 0xff) / 255
  const r = (unsigned >>> 16) & 0xff
  const g = (unsigned >>> 8) & 0xff
  const b = unsigned & 0xff

  return toHex(r, g, b, alpha)
}

const parseHexString = (value: string): HexColorToken | undefined => {
  const normalized = value.startsWith('#') ? value.slice(1) : value
  if (!/^[0-9a-fA-F]+$/.test(normalized)) {
    return undefined
  }

  if (normalized.length === 3 || normalized.length === 4) {
    const expanded = normalized.split('').map((char) => `${char}${char}`).join('')
    return parseHexString(expanded)
  }

  if (normalized.length !== 6 && normalized.length !== 8) {
    return undefined
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const alpha = normalized.length === 8
    ? Number.parseInt(normalized.slice(6, 8), 16) / 255
    : 1

  return toHex(r, g, b, alpha)
}

const parseNumericChannel = (raw: string, percentScale: number): number => {
  const trimmed = raw.trim()
  if (trimmed.endsWith('%')) {
    return (Number.parseFloat(trimmed.slice(0, -1)) / 100) * percentScale
  }

  return Number.parseFloat(trimmed)
}

const parseRgbString = (value: string): HexColorToken | undefined => {
  const match = /^rgba?\(\s*([^\s,/]+)[\s,]+([^\s,/]+)[\s,]+([^\s,/]+)(?:\s*[,/]\s*([^\s,/]+))?\s*\)$/i.exec(value)
  if (!match) {
    return undefined
  }

  const r = parseNumericChannel(match[1], 255)
  const g = parseNumericChannel(match[2], 255)
  const b = parseNumericChannel(match[3], 255)
  const alpha = match[4] === undefined ? 1 : parseNumericChannel(match[4], 1)

  if ([r, g, b, alpha].some((channel) => Number.isNaN(channel))) {
    return undefined
  }

  return toHex(r, g, b, alpha)
}

const hueToRgb = (p: number, q: number, t: number): number => {
  let wrapped = t
  if (wrapped < 0) {
    wrapped += 1
  }
  if (wrapped > 1) {
    wrapped -= 1
  }
  if (wrapped < 1 / 6) {
    return p + (q - p) * 6 * wrapped
  }
  if (wrapped < 1 / 2) {
    return q
  }
  if (wrapped < 2 / 3) {
    return p + (q - p) * (2 / 3 - wrapped) * 6
  }

  return p
}

const hslToRgb = (hue: number, saturation: number, lightness: number): [number, number, number] => {
  if (saturation === 0) {
    const gray = lightness * 255
    return [gray, gray, gray]
  }

  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q
  const h = (((hue % 360) + 360) % 360) / 360

  return [
    hueToRgb(p, q, h + 1 / 3) * 255,
    hueToRgb(p, q, h) * 255,
    hueToRgb(p, q, h - 1 / 3) * 255,
  ]
}

const parseHslString = (value: string): HexColorToken | undefined => {
  const match = /^hsla?\(\s*([^\s,/]+)(?:deg)?[\s,]+([^\s,/]+)[\s,]+([^\s,/]+)(?:\s*[,/]\s*([^\s,/]+))?\s*\)$/i.exec(value)
  if (!match) {
    return undefined
  }

  const hue = Number.parseFloat(match[1])
  const saturation = parseNumericChannel(match[2], 1)
  const lightness = parseNumericChannel(match[3], 1)
  const alpha = match[4] === undefined ? 1 : parseNumericChannel(match[4], 1)

  if ([hue, saturation, lightness, alpha].some((channel) => Number.isNaN(channel))) {
    return undefined
  }

  const [r, g, b] = hslToRgb(hue, saturation, lightness)
  return toHex(r, g, b, alpha)
}

const parseColorLiteral = (color: ColorValue | number): HexColorToken | undefined => {
  if (typeof color === 'number') {
    return argbNumberToHex(color)
  }

  if (typeof color !== 'string') {
    return undefined
  }

  const trimmed = color.trim()
  if (trimmed.length === 0) {
    return undefined
  }

  if (trimmed.toLowerCase() === 'transparent') {
    return DesignHexColorUtils.resolveColorToken('transparent')
  }

  return parseHexString(trimmed)
    ?? parseRgbString(trimmed)
    ?? parseHslString(trimmed)
}

const tryParseColorValue = (color: ColorValue | number): HexColorToken | undefined => {
  const fromLiteral = parseColorLiteral(color)
  if (fromLiteral !== undefined) {
    return fromLiteral
  }

  const processed = processColor(color)
  if (typeof processed === 'number') {
    return argbNumberToHex(processed)
  }

  if (typeof processed === 'string' && processed !== color) {
    return parseColorLiteral(processed)
  }

  return undefined
}

const parseColorValue = (color: ColorValue | number): HexColorToken => {
  const parsed = tryParseColorValue(color)
  if (parsed === undefined) {
    throw new Error(`Unable to parse ColorValue to hex: ${String(color)}`)
  }

  return parsed
}

export const HexColorUtils = {
  ...DesignHexColorUtils,
  tryParseColorValue,
  parseColorValue,
}
