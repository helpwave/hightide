import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import {
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatThreadHeaderTokens = {
  container: ContainerTokens,
  contentRow: ContainerTokens,
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
  avatarOverride: AvatarOverrideTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatThreadHeaderTokens
>

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, shape, borderWidth, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xl,
        horizontal: spacing.lg,
      },
      border: {
        width: {
          type: 'physicalSide',
          bottom: borderWidth.thin,
        },
        color: {
          type: 'physicalSide',
          bottom: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: spacing.md,
      },
    },
    contentRow: {
      layout: {
        direction: 'vertical',
        gap: spacing.xs,
      },
    },
    title: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.bold,
      color: color.surface.onColor,
    },
    subtitle: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.light,
      color: descriptionColor,
    },
    avatarOverride: {
      overrides: {
        size: 'lg',
      },
    },
  }
}
