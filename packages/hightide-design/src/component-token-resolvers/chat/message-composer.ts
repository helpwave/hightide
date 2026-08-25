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
  const { color, size, spacing, padding, borderRadius, borderWidth, typography } = themeTokens
  const placeholderColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      padding: {
        type: 'physicalAxis',
        vertical: padding.xl,
        horizontal: padding.xl,
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
        flexGrow: 1,
        direction: 'horizontal',
        crossAxisAlignment: 'end',
        gap: spacing.md,
      },
    },
    input: {
      backgroundColor: color.surfaceVariant.color,
      size: {
        minHeight: size.md,
        maxHeight: Math.max(size.md, typography.body.md.lineHeight * 8 + 2 * padding.md),
      },
      shape: {
        borderRadius: { type: 'all', value: borderRadius.sm },
      },
      padding: {
        type: 'logicalSide',
        blockStart:  padding.md,
        blockEnd:  padding.md,
        inlineStart: semanticResolvers.controlLayout({ themeTokens, size: 'md' }).horizontalContentPadding,
        inlineEnd: padding.md,
      },
      layout: {
        flexGrow: 1,
        flexShrink: 1,
      }
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
