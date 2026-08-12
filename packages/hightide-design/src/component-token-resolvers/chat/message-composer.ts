import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  composerMaxLines,
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatMessageComposerTokens = {
  container: ContainerTokens,
  input: ContainerTokens,
  text: TextStyleTokens,
  placeholder: TextStyleTokens,
}

export type ChatMessageComposerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageComposerTokens
>

export const chatMessageComposerTokenResolver: ChatMessageComposerTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, size, spacing, shape, borders, typography } = themeTokens
  const placeholderColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      size: {
        width: '100%',
      },
      shape: {
        padding: {
          vertical: shape.padding.xxl,
          horizontal: spacing.lg,
        },
      },
      border: {
        width: {
          type: 'physicalSide',
          top: borders.borderWidths.thin,
        },
        color: {
          type: 'physicalSide',
          top: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'end',
        gap: spacing.md,
      },
    },
    input: {
      backgroundColor: color.surfaceVariant.color,
      size: {
        minHeight: size.md,
        maxHeight: size.md * composerMaxLines,
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
        padding: {
          vertical: shape.padding.xxl,
          horizontal: shape.padding.xxl,
        },
      },
    },
    text: {
      ...typography.body.md,
      color: color.surface.onColor,
    },
    placeholder: {
      color: placeholderColor,
    },
  }
}
