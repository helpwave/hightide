import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  messageCardMaxWidth,
  messageCardWidth,
  resolveAccentColoring,
  resolveAlignment,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveMessageCorners,
  type ChatMessageDirection
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
  container: ContainerTokens,
  header: ContainerTokens,
  icon: ContainerTokens,
  iconColor: IconTokens,
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
  body: ContainerTokens,
  actions: ContainerTokens,
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
      backgroundColor: color.surface.color,
      overflow: 'hidden',
      size: {
        width: messageCardWidth,
        maxWidth: messageCardMaxWidth,
      },
      shape: {
        borderRadius: messageCorners,
      },
      border: {
        width: {
          type: 'all',
          value: hairline,
        },
        color: {
          type: 'all',
          value: fadedBorder,
        },
      },
      layout: {
        alignSelf: alignment,
      },
    },
    header: {
      shape: {
        padding: {
          vertical: shape.padding.xxl,
          horizontal: spacing.lg,
        },
      },
      border: {
        width: {
          type: 'physicalSide',
          bottom: hairline,
        },
        color: {
          type: 'physicalSide',
          bottom: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xl,
      },
    },
    icon: {
      backgroundColor: accentTonal.background,
      size: {
        width: size.xs + spacing.md,
        height: size.xs + spacing.md,
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
      },
      layout: {
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
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
      shape: {
        padding: {
          vertical: shape.padding.xxl,
          horizontal: spacing.lg,
        },
      },
      layout: {
        gap: spacing.sm,
      },
    },
    actions: {
      shape: {
        padding: {
          vertical: spacing.lg,
          horizontal: spacing.lg,
        },
      },
      layout: {
        direction: 'horizontal',
        gap: shape.padding.xl,
      },
    },
  }
}
