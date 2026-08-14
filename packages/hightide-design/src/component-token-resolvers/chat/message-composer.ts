import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
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
  const { color, size, spacing, shape, borderWidth, typography } = themeTokens
  const placeholderColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      size: {
        width: '100%',
      },
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xl,
        horizontal: shape.padding.xl,
      },
      border: {
        width: {
          type: 'physicalSide',
          top: borderWidth.thin,
        },
        color: {
          type: 'physicalSide',
          top: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'end',
        gap: spacing.xs,
      },
    },
    input: {
      backgroundColor: color.surfaceVariant.color,
      size: {
        minHeight: size.md,
        maxHeight: Math.max(size.md, typography.body.md.lineHeight * 8 + 2 * shape.padding.md),
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
      },
      padding: {
        type: 'logicalSide',
        blockStart:  shape.padding.md,
        blockEnd:  shape.padding.md,
        inlineStart: semanticResolvers.controlLayout({ themeTokens, size: 'md' }).horizontalContentPadding,
        inlineEnd: shape.padding.md,
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
