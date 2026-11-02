export type HexColor = `#${string}`

export type ColorChannels = {
  hue: number,
  saturation: number,
  valueLevel: number,
  alphaLevel: number,
}

const HUE_END = 359.999

export function defaultHex(alpha: boolean): HexColor {
  return alpha ? '#000000ff' : '#000000'
}

export function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function pointerRatio(client: number, origin: number, size: number): number {
  if (size <= 0) return 0
  return clampUnit((client - origin) / size)
}

export function hueUnitToDegrees(unit: number): number {
  return clampUnit(unit) * HUE_END
}

export function hueDegreesToUnit(degrees: number): number {
  const positive = ((degrees % 360) + 360) % 360
  if (positive === 0) return 0
  return clampUnit(positive / HUE_END)
}

function duplicateDigits(body: string): string {
  return body.split('').map((digit) => digit + digit).join('')
}

function channelHex(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, '0')
}

function asHex(value: string): HexColor {
  return value as HexColor
}

function hsvToRgb(hue: number, saturation: number, valueLevel: number): [number, number, number] {
  const chroma = clampUnit(valueLevel) * clampUnit(saturation)
  const hueSector = hueUnitToDegrees(hue) / 60
  const secondary = chroma * (1 - Math.abs(hueSector % 2 - 1))
  let red = 0
  let green = 0
  let blue = 0
  if (hueSector < 1) {
    red = chroma
    green = secondary
  } else if (hueSector < 2) {
    red = secondary
    green = chroma
  } else if (hueSector < 3) {
    green = chroma
    blue = secondary
  } else if (hueSector < 4) {
    green = secondary
    blue = chroma
  } else if (hueSector < 5) {
    red = secondary
    blue = chroma
  } else {
    red = chroma
    blue = secondary
  }
  const match = clampUnit(valueLevel) - chroma
  return [(red + match) * 255, (green + match) * 255, (blue + match) * 255]
}

export function sanitizeHexText(raw: string, alpha: boolean): string {
  let body = ''
  for (const char of raw) {
    if (/[0-9a-fA-F]/.test(char)) body += char.toLowerCase()
  }
  return `#${body.slice(0, alpha ? 8 : 6)}`
}

export function expandHexInput(raw: string, alpha: boolean): HexColor | undefined {
  const body = sanitizeHexText(raw, alpha).slice(1)
  if (!alpha) {
    if (body.length === 6) return `#${body}`
    if (body.length === 1) return `#${body.repeat(6)}`
    if (body.length === 3) return `#${duplicateDigits(body)}`
    return undefined
  }
  if (body.length === 8) return `#${body}`
  if (body.length === 6) return `#${body}ff`
  if (body.length === 1) return `#${body.repeat(8)}`
  if (body.length === 3) return `#${duplicateDigits(body)}ff`
  if (body.length === 4) return `#${duplicateDigits(body)}`
  return undefined
}

export function coerceHex(value: string, alpha: boolean): HexColor {
  return expandHexInput(value, alpha) ?? defaultHex(alpha)
}

export function channelsToHex(channels: ColorChannels, alpha: boolean): HexColor {
  const [red, green, blue] = hsvToRgb(channels.hue, channels.saturation, channels.valueLevel)
  const rgb = asHex(`#${channelHex(red)}${channelHex(green)}${channelHex(blue)}`)
  if (!alpha) return rgb
  return asHex(`${rgb}${channelHex(clampUnit(channels.alphaLevel) * 255)}`)
}

export function hexToChannels(value: string, alpha: boolean): ColorChannels {
  const hex = coerceHex(value, alpha)
  const body = hex.slice(1)
  const red = Number.parseInt(body.slice(0, 2), 16) / 255
  const green = Number.parseInt(body.slice(2, 4), 16) / 255
  const blue = Number.parseInt(body.slice(4, 6), 16) / 255
  const alphaLevel = alpha ? Number.parseInt(body.slice(6, 8), 16) / 255 : 1
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hueDegrees = 0
  if (delta !== 0) {
    if (max === red) hueDegrees = ((green - blue) / delta) % 6
    else if (max === green) hueDegrees = (blue - red) / delta + 2
    else hueDegrees = (red - green) / delta + 4
    hueDegrees *= 60
    if (hueDegrees < 0) hueDegrees += 360
  }
  return {
    hue: hueDegreesToUnit(hueDegrees),
    saturation: max === 0 ? 0 : delta / max,
    valueLevel: max,
    alphaLevel,
  }
}

export function saturatedHueHex(hue: number): HexColor {
  return channelsToHex({ hue, saturation: 1, valueLevel: 1, alphaLevel: 1 }, false)
}
