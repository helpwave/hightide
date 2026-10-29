import type { ColorChannels, HexColor } from './hexColor'
import { channelsToHex, clampUnit, coerceHex, expandHexInput, hexToChannels, sanitizeHexText } from './hexColor'

export type ColorInputState = {
  value: HexColor,
  text: string,
  isOpen: boolean,
  hue: number,
  saturation: number,
  valueLevel: number,
  alphaLevel: number,
}

export type ColorInputEvent =
  | { type: 'textChange', text: string }
  | { type: 'commitText' }
  | { type: 'pickSaturation', saturation: number, valueLevel: number }
  | { type: 'pickHue', hue: number }
  | { type: 'pickAlpha', alphaLevel: number }
  | { type: 'sync', value: HexColor }
  | { type: 'resetAlpha' }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'focus' }
  | { type: 'blur' }

function channelsOf(state: ColorInputState): ColorChannels {
  return {
    hue: state.hue,
    saturation: state.saturation,
    valueLevel: state.valueLevel,
    alphaLevel: state.alphaLevel,
  }
}

function applyChannels(state: ColorInputState, channels: ColorChannels, alpha: boolean): ColorInputState {
  const value = channelsToHex(channels, alpha)
  return {
    ...state,
    ...channels,
    value,
    text: value,
  }
}

function applyHex(state: ColorInputState, value: string, alpha: boolean, keepAchromaticHue: boolean): ColorInputState {
  const hex = coerceHex(value, alpha)
  const channels = hexToChannels(hex, alpha)
  const hue = keepAchromaticHue && (channels.saturation === 0 || channels.valueLevel === 0)
    ? state.hue
    : channels.hue
  return {
    ...state,
    ...channels,
    hue,
    value: hex,
    text: hex,
  }
}

function applyTextChange(state: ColorInputState, raw: string): ColorInputState {
  const text = sanitizeHexText(raw, true)
  const body = text.slice(1)
  if (body.length !== 8) return { ...state, text }
  return applyHex(state, `#${body}`, true, true)
}

function applyCommit(state: ColorInputState): ColorInputState {
  const expanded = expandHexInput(state.text, true)
  if (!expanded) return { ...state, text: state.value }
  return applyHex(state, expanded, true, true)
}

function applyResetAlpha(state: ColorInputState): ColorInputState {
  const opaque = `${state.value.slice(0, 7)}ff`
  if (opaque === state.value && state.text === state.value && state.alphaLevel === 1) return state
  return applyHex(state, opaque, true, true)
}

export function colorInputStateFromHex(value: string): ColorInputState {
  const hex = coerceHex(value, true)
  const channels = hexToChannels(hex, true)
  return {
    value: hex,
    text: hex,
    isOpen: false,
    ...channels,
  }
}

export function colorInputStateTransition(
  state: ColorInputState,
  event: ColorInputEvent
): ColorInputState {
  switch (event.type) {
    case 'textChange':
      return applyTextChange(state, event.text)
    case 'commitText':
    case 'blur':
      return applyCommit(state)
    case 'pickSaturation':
      return applyChannels(state, {
        ...channelsOf(state),
        saturation: clampUnit(event.saturation),
        valueLevel: clampUnit(event.valueLevel),
      }, true)
    case 'pickHue':
      return applyChannels(state, {
        ...channelsOf(state),
        hue: clampUnit(event.hue),
      }, true)
    case 'pickAlpha':
      return applyChannels(state, {
        ...channelsOf(state),
        alphaLevel: clampUnit(event.alphaLevel),
      }, true)
    case 'sync':
      return applyHex(state, event.value, true, true)
    case 'resetAlpha':
      return applyResetAlpha(state)
    case 'open':
      return { ...state, isOpen: true }
    case 'close':
      return { ...state, isOpen: false }
    case 'focus':
      return state
  }
}


