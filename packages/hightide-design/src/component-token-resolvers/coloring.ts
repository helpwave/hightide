import type {
  ColoringStyle,
  ColoringTokens,
  SemanticTokenResolvers
} from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates } from './pressable'
import { OKLCHUtils } from '../utils/oklch'

export type ColoringResolverParams = {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  style: ColoringStyle,
  state?: PressableInteractionState,
}

export const resolveColorPairColoring = (
  params: ColoringResolverParams & { colorPair: ColorPairToken }
): ColoringTokens => {
  const { themeTokens, semanticResolvers, colorPair, style, state } = params

  let usedColorPair: ColorPairToken = colorPair
  if(style === 'tonal' || style === 'tonal-outline') {
    usedColorPair = {
      color: OKLCHUtils.changeLightness(colorPair.color, 0.95),
      onColor:  OKLCHUtils.changeLightness(colorPair.color, 0.2),
    }
  }

  const colorScheme = semanticResolvers.colorScheme({
    themeTokens,
    semanticResolvers,
    colorPair: usedColorPair,
  })

  return semanticResolvers.coloringStyle({
    themeTokens,
    semanticResolvers,
    colorScheme,
    style,
    state: toActivePressableStates(state ?? {}),
  })
}
