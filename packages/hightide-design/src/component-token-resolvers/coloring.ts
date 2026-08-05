import type {
  ColoringStyle,
  ColoringTokens,
  SemanticTokenResolvers
} from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates } from './pressable'
import { HexColorUtils } from '../utils'

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
  if(style === 'outline' || style === 'tonal-outline') {
    usedColorPair = {
      color: HexColorUtils.blendOver(themeTokens.color.surface.color, colorPair.color, 0.3),
      onColor:  HexColorUtils.blendOver(themeTokens.color.surface.onColor, colorPair.color, themeTokens.color.tintConfig.light),
    }
  }

  const colorScheme = semanticResolvers.colorScheme({
    themeTokens,
    semanticResolvers,
    colorPair: usedColorPair,
  })

  console.log({ usedColorPair, colorScheme })

  return semanticResolvers.coloringStyle({
    themeTokens,
    semanticResolvers,
    colorScheme,
    style,
    state: toActivePressableStates(state ?? {}),
  })
}
