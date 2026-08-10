import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type { PressableState } from '../component-token-resolvers/pressable'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'
import {
  mapPressableVariant,
  resolveColoringColorVariant,
  resolveColoringStyle
} from './coloring-style'
import type {
  ColoringToken,
  PressableColoringTokens,
  PressableVariant
} from './types'

const getTintAlpha = (tint: ColorToken): number => {
  if (tint === 'transparent') {
    return 0
  }
  const expanded = tint.startsWith('#') ? tint.slice(1) : tint
  if (expanded.length === 8) {
    return Number.parseInt(expanded.slice(6, 8), 16) / 255
  }
  if (expanded.length === 4) {
    return Number.parseInt(expanded.slice(3, 4) + expanded.slice(3, 4), 16) / 255
  }
  return 1
}

const compositeTint = (
  background: ColorToken,
  tint: ColorToken
): ColorToken => {
  if (tint === 'transparent') {
    return background
  }
  if (background === 'transparent') {
    return tint
  }
  return HexColorUtils.blendOver(background, tint, getTintAlpha(tint))
}

const toPressableColoringTokens = (
  coloring: ColoringToken,
  variant: PressableVariant,
  isFocusVisible: boolean
): PressableColoringTokens => ({
  background: coloring.background,
  foreground: coloring.foreground,
  border: variant === 'outlined' ? coloring.accent : 'transparent',
  outline: isFocusVisible ? coloring.accent : 'transparent',
})

export const resolvePressableStateLayerTint = (params: {
  themeTokens: ThemeTokens,
  states: ReadonlySet<PressableState>,
  color: ColorToken,
}): ColorToken => {
  const { tintConfig } = params.themeTokens.color
  const { color, states } = params

  if (color === 'transparent') {
    return 'transparent'
  }

  if (states.has('focused') || states.has('pressed')) {
    return HexColorUtils.hexWithAlpha(color, tintConfig.normal)
  }
  if (states.has('hovered')) {
    return HexColorUtils.hexWithAlpha(color, tintConfig.light)
  }
  return 'transparent'
}

export const resolvePressableColoring = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringToken,
  variant: PressableVariant,
  state: ReadonlySet<PressableState>,
}): PressableColoringTokens => {
  const { themeTokens, variant, state } = params
  const { colorVariant, style } = mapPressableVariant(variant)

  if (state.has('disabled')) {
    const { surface, disabled } = themeTokens.color

    if (colorVariant === 'tonal') {
      const coloring: ColoringToken = {
        background: HexColorUtils.blendOver(surface.color, disabled.color, 0.8),
        foreground: HexColorUtils.blendOver(surface.onColor, disabled.onColor, 0.8),
        accent: HexColorUtils.blendOver(surface.color, disabled.color, 0.8),
      }
      return toPressableColoringTokens(coloring, variant, false)
    }

    const coloring = resolveColoringStyle({
      coloring: resolveColoringColorVariant({
        colorPair: disabled,
        variant: colorVariant,
      }),
      style,
    })
    return toPressableColoringTokens(coloring, variant, false)
  }

  let { background } = params.coloring
  const { foreground, accent } = params.coloring

  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: foreground === 'transparent' ? '#FFFFFF' as HexColorToken : foreground,
  })
  background = compositeTint(background, tint)

  return toPressableColoringTokens(
    { background, foreground, accent },
    variant,
    state.has('focusVisible')
  )
}
