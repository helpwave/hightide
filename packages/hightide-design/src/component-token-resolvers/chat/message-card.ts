import type { ColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  messageCardMaxWidth,
  messageCardWidth,
  resolveAccentColoring,
  resolveAlignment,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveMessageCorners,
  type ChatCornerRadiusTokens,
  type ChatIconTokens,
  type ChatMessageDirection,
  type ChatAlignment
} from './shared'

export type ChatMessageCardComponentResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
  overrides: {
    color?: ColorPairToken,
  },
}

export type ChatMessageCardTokens = {
  container: ChatCornerRadiusTokens & {
    width: number,
    maxWidth: number,
    backgroundColor: ColorToken,
    borderWidth: number,
    borderColor: ColorToken,
    overflow: 'hidden',
    alignSelf: ChatAlignment,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderBottomWidth: number,
    borderBottomColor: ColorToken,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: number,
    height: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  iconColor: ChatIconTokens,
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
  body: {
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
  },
  actions: {
    flexDirection: 'row',
    gap: number,
    paddingHorizontal: number,
    paddingBottom: number,
  },
}

export type ChatMessageCardTokenResolver = ComponentTokenResolver<
  ChatMessageCardComponentResolverProps,
  ChatMessageCardTokens
>

export const chatMessageCardTokenResolver: ChatMessageCardTokenResolver = ({ themeTokens, semanticResolvers, config, overrides }) => {
  const { color, size, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const { accentTonal, accentText } = resolveAccentColoring({
    themeTokens,
    color: overrides.color,
  })
  const alignment = resolveAlignment(config.direction)
  const messageCorners = resolveMessageCorners(themeTokens, config.direction)
  const hairline = borders.borderWidths.thin

  return {
    container: {
      ...messageCorners,
      width: messageCardWidth,
      maxWidth: messageCardMaxWidth,
      backgroundColor: color.surface.color,
      borderWidth: hairline,
      borderColor: fadedBorder,
      overflow: 'hidden',
      alignSelf: alignment,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xl,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: hairline,
      borderBottomColor: fadedBorder,
    },
    icon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size.xs + spacing.md,
      height: size.xs + spacing.md,
      borderRadius: shape.borderRadius.sm,
      backgroundColor: accentTonal.background,
    },
    iconColor: {
      color: accentTonal.foreground,
    },
    title: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.bold,
      color: accentText.foreground,
    },
    subtitle: {
      ...typography.body.sm,
      color: descriptionColor,
    },
    body: {
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    actions: {
      flexDirection: 'row',
      gap: shape.padding.xl,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
  }
}
