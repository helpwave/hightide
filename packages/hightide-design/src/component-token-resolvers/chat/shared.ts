import type { ColorToken, HexColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../../theme-tokens/theme-tokens'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  type SemanticTokenResolvers
} from '../../semantic-token-resolvers'
import type { PressableStateValue } from '../pressable-tokens'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatAlignment = 'flex-start' | 'flex-end'

export type ChatIconTokens = {
  color: ColorToken,
}

export type ChatCornerRadiusTokens = {
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
}

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
      coloring: resolveColoringColorVariant({
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
      coloring: resolveColoringColorVariant({
        colorPair: accentPair,
        variant: 'tonal',
      }),
      style: 'filled',
    }),
    accentText: resolveColoringStyle({
      coloring: resolveColoringColorVariant({
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
): ChatCornerRadiusTokens => {
  const isOutgoing = direction === 'outgoing'
  const radius = themeTokens.shape.borderRadius.lg
  const corner = themeTokens.shape.borderRadius.xs

  return {
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: isOutgoing ? radius : corner,
    borderBottomRightRadius: isOutgoing ? corner : radius,
  }
}

export const resolveAlignment = (direction?: ChatMessageDirection): ChatAlignment => (
  direction === 'outgoing' ? 'flex-end' : 'flex-start'
)
