import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatThreadHeaderTokens = {
  container: ContainerTokens,
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatThreadHeaderTokens
>

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      shape: {
        padding: {
          vertical: shape.padding.xxl,
          horizontal: spacing.lg,
        },
      },
      border: {
        width: {
          type: 'physicalSide',
          bottom: borders.borderWidths.thin,
        },
        color: {
          type: 'physicalSide',
          bottom: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xxl,
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
  }
}
