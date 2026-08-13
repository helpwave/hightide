import type { ColorToken, HexColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../../theme-tokens/theme-tokens'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  type SemanticTokenResolvers
} from '../../semantic-token-resolvers'
import type { AxisAligmentToken, BorderRadiusToken } from '../container-tokens'
import type { PressableStateValue } from '../pressable-tokens'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export const pillBorderRadius = 999
export const bubbleMaxWidth = 280
export const messageCardWidth = 290
export const messageCardMaxWidth = 300
export const composerMaxLines = 7

type ThemeParams = {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
}

export const resolveDescriptionColor = ({
  themeTokens,
  semanticResolvers,
}: ThemeParams): HexColorToken => (
  semanticResolvers.asDescription({
    themeTokens,
    color: themeTokens.color.surface.onColor,
  })
)

export const resolveFadedBorder = ({
  themeTokens,
  semanticResolvers,
}: ThemeParams): HexColorToken => (
  semanticResolvers.asFaded({
    themeTokens,
    color: themeTokens.color.surface.onColor,
  })
)

export const resolveHoverColor = ({
  themeTokens,
}: Pick<ThemeParams, 'themeTokens'>): ColorToken => (
  resolvePressableColoring({
    themeTokens,
    coloring: resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: themeTokens.color.surface,
        variant: 'normal',
      }),
      style: 'filled',
    }),
    variant: 'filled',
    state: new Set<PressableStateValue>(['hovered']),
  }).background
)

export const resolveAccentColoring = ({
  themeTokens,
  color,
}: Pick<ThemeParams, 'themeTokens'> & {
  color?: ColorPairToken,
}) => {
  const accentPair = color ?? themeTokens.color.primary
  return {
    accentPair,
    accentTonal: resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: accentPair,
        variant: 'tonal',
      }),
      style: 'filled',
    }),
    accentText: resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: accentPair,
        variant: 'normal',
      }),
      style: 'foreground',
    }),
  }
}

export const resolveMessageCorners = (
  themeTokens: ThemeTokens,
  direction?: ChatMessageDirection
): BorderRadiusToken => {
  const isOutgoing = direction === 'outgoing'
  const radius = themeTokens.shape.borderRadius.lg
  const corner = themeTokens.shape.borderRadius.xs

  return {
    type: 'physicalCorner',
    topLeft: radius,
    topRight: radius,
    bottomLeft: isOutgoing ? radius : corner,
    bottomRight: isOutgoing ? corner : radius,
  }
}

export const resolveAlignment = (direction?: ChatMessageDirection): AxisAligmentToken => (
  direction === 'outgoing' ? 'end' : 'start'
)
