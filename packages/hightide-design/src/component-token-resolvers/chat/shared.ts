import type { ColorToken, HexColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../../theme-tokens/theme-tokens'
import type { SemanticTokenResolvers } from '../../semantic-token-resolvers/types'
import { resolveColorPairColoring } from '../coloring'

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
    semanticResolvers,
    color: themeTokens.color.surface.onColor,
  })
)

export const resolveFadedBorder = ({
  themeTokens,
  semanticResolvers,
}: ThemeParams): HexColorToken => (
  semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: themeTokens.color.surface.onColor,
  })
)

export const resolveHoverColor = ({
  themeTokens,
  semanticResolvers,
}: ThemeParams): ColorToken => (
  resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: themeTokens.color.surface,
    style: 'filled',
    state: { isHovered: true },
  }).color
)

export const resolveAccentColoring = ({
  themeTokens,
  semanticResolvers,
  color,
}: ThemeParams & {
  color?: ColorPairToken,
}) => {
  const accentPair = color ?? themeTokens.color.primary
  return {
    accentPair,
    accentTonal: resolveColorPairColoring({
      themeTokens,
      semanticResolvers,
      colorPair: accentPair,
      style: 'tonal',
    }),
    accentText: resolveColorPairColoring({
      themeTokens,
      semanticResolvers,
      colorPair: accentPair,
      style: 'text',
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
