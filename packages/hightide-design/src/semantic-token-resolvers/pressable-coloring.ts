import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type { PressableState } from '../component-token-resolvers/pressable'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'
import { resolveColoringStyle } from './coloring-style'
import type {
  ColoringStyle,
  ColoringTokens,
  PressableColoringTokens
} from './types'

const isOutlinedStyle = (style: ColoringStyle): boolean => (
  style === 'outline' || style === 'tonal-outline'
)

const blendBackground = (
  background: ColorToken,
  text: ColorToken,
  alpha: number
): ColorToken => {
  const resolvedText: HexColorToken = text === 'transparent' ? '#FFFFFF00': text
  if (background === 'transparent') {
    return HexColorUtils.hexWithAlpha(resolvedText, alpha)
  }

  return HexColorUtils.blendOver(background, resolvedText, alpha)
}

const toPressableColoringTokens = (
  coloring: ColoringTokens,
  style: ColoringStyle,
  isFocusVisible: boolean
): PressableColoringTokens => ({
  background: coloring.background,
  text: coloring.text,
  border: isOutlinedStyle(style) ? coloring.accent : 'transparent',
  outline: isFocusVisible ? coloring.accent : 'transparent',
})

export const resolvePressableColoring = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringTokens,
  style: ColoringStyle,
  state: ReadonlySet<PressableState>,
}): PressableColoringTokens => {
  const { themeTokens, style, state } = params
  const { tintConfig } = themeTokens.color

  if (state.has('disabled')) {
    const { surface, disabled } = themeTokens.color
    let coloring = resolveColoringStyle({
      themeTokens,
      colorPair: disabled,
      style,
    })

    if (style === 'tonal' || style === 'tonal-outline') {
      coloring = {
        background: HexColorUtils.blendOver(surface.color, disabled.color, 0.8),
        text: HexColorUtils.blendOver(surface.onColor, disabled.onColor, 0.8),
        accent: HexColorUtils.blendOver(surface.color, disabled.color, 0.8),
      }
    }

    return toPressableColoringTokens(coloring, style, false)
  }

  let { background } = params.coloring
  const { text, accent } = params.coloring

  if (state.has('pressed') || state.has('focusVisible')) {
    background = blendBackground(background, text, tintConfig.normal)
  } else if (state.has('hovered')) {
    background = blendBackground(background, text, tintConfig.light)
  }

  return toPressableColoringTokens(
    { background, text, accent },
    style,
    state.has('focusVisible')
  )
}
