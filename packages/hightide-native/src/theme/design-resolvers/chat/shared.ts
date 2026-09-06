import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { ColorPairToken, ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import type { SemanticTokenResolvers } from '@helpwave/hightide-design/semantic-tokens'
import {
  messageCornersTokens,
  surfaceDescriptionColor,
  surfaceFadedColor,
  type AxisAligmentToken,
  type BorderRadiusToken,
  type ChatMessageDirection,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring
} from '../semantic'

type ThemeParams = {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
}

export const resolveDescriptionColor = ({
  themeTokens,
}: ThemeParams): HexColorToken => (
  resolveTokenConfig<HexColorToken>(
    surfaceDescriptionColor,
    new Set(),
    { theme: themeTokens }
  )
)

export const resolveFadedBorder = ({
  themeTokens,
}: ThemeParams): HexColorToken => (
  resolveTokenConfig<HexColorToken>(
    surfaceFadedColor,
    new Set(),
    { theme: themeTokens }
  )
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
): BorderRadiusToken => (
  resolveTokenConfig<BorderRadiusToken>(
    messageCornersTokens,
    new Set(direction === 'outgoing' ? ['outgoing'] : []),
    { theme: themeTokens }
  )
)

export const resolveAlignment = (direction?: ChatMessageDirection): AxisAligmentToken => (
  direction === 'outgoing' ? 'end' : 'start'
)
