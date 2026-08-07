import type {
  ColoringStyle,
  ColoringTokens
} from '../semantic-token-resolvers/types'
import { resolveColorScheme } from '../semantic-token-resolvers/color-scheme'
import { resolveColoringStyle } from '../semantic-token-resolvers/coloring-style'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates } from './pressable'
import { OKLCHUtils } from '../utils/oklch'

export type ColoringResolverParams = {
  themeTokens: ThemeTokens,
  style: ColoringStyle,
  state?: PressableInteractionState,
}

export const resolveColorPairColoring = (
  params: ColoringResolverParams & { colorPair: ColorPairToken }
): ColoringTokens => {
  const { themeTokens, colorPair, style, state } = params

  let usedColorPair: ColorPairToken = colorPair
  if(style === 'tonal' || style === 'tonal-outline') {
    usedColorPair = {
      color: OKLCHUtils.changeLightness(colorPair.color, 0.95),
      onColor:  OKLCHUtils.changeLightness(colorPair.color, 0.2),
    }
  }

  const colorScheme = resolveColorScheme({
    themeTokens,
    colorPair: usedColorPair,
  })

  return resolveColoringStyle({
    themeTokens,
    colorScheme,
    style,
    state: toActivePressableStates(state ?? {}),
  })
}
