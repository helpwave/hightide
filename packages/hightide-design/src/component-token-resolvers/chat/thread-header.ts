import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
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
  pressableOverwrites: PressableOverrideTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatThreadHeaderTokens
>

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, shape, borderWidth, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const title: TextStyleTokens = {
    ...typography.body.md,
    fontWeight: typography.fontWeights.bold,
    color: color.surface.onColor,
  }
  const subtitle: TextStyleTokens = {
    ...typography.body.sm,
    fontWeight: typography.fontWeights.light,
    color: descriptionColor,
  }
  const contentRow: ContainerTokens = {
    layout: {
      direction: 'vertical',
      gap: spacing.xs,
      flexGrow: 1,
    },
  }
  const avatarSize = Math.max((title.lineHeight ?? 0)
    + (subtitle.lineHeight ?? 0)
    + (contentRow.layout?.gap ?? 0), themeTokens.icongraphy.sizes.lg)

  return {
    container: {
      backgroundColor: color.surface.color,
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.sm,
        horizontal: shape.padding.md,
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
        gap: spacing.xs,
      },
    },
    contentRow,
    title,
    subtitle,
    avatarOverride: {
      container: {
        size: {
          width: avatarSize,
          height: avatarSize,
          minWidth: avatarSize,
          minHeight: avatarSize,
          maxWidth: avatarSize,
          maxHeight: avatarSize,
        },
        shape: {
          borderRadius: { type: 'all', value: avatarSize / 2 },
        },
      },
      icon: {
        size: avatarSize,
      },
    },
    pressableOverwrites: {
      overrides: {
        size: 'md',
        coloringStyle: 'foreground',
        coloringColorVariant: 'transparent',
      },
      container: {
        size: {
          minHeight: 0,
        },
        padding: {
          type: 'all',
          value: shape.padding.md,
        },
        layout: {
          direction: 'horizontal',
          crossAxisAligment: 'center',
          gap: spacing.md,
          flexGrow: 1,
          selfCrossAxisAlignment: 'stretch',
        },
      },
    },
  }
}
