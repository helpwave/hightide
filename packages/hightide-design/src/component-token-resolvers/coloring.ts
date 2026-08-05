import type {
  ColoringStyle,
  ColoringTokens,
  SemanticTokenResolvers
} from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates } from './pressable'

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
  const colorScheme = semanticResolvers.colorScheme({
    themeTokens,
    semanticResolvers,
    colorPair,
  })

  return semanticResolvers.coloringStyle({
    themeTokens,
    semanticResolvers,
    colorScheme,
    style,
    state: toActivePressableStates(state ?? {}),
  })
}
