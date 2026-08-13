import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  bubbleMaxWidth,
  resolveAlignment,
  resolveDescriptionColor,
  resolveMessageCorners,
  type ChatMessageDirection
} from './shared'

export type ChatMessageBubbleComponentResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatMessageBubbleTokens = {
  container: ContainerTokens,
  bubble: ContainerTokens,
  content: TextStyleTokens,
  timestamp: TextStyleTokens,
  receipt: ContainerTokens,
  receiptText: TextStyleTokens,
  receiptIcon: IconTokens,
}

export type ChatMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatMessageBubbleComponentResolverProps,
  ChatMessageBubbleTokens
>

export const chatMessageBubbleTokenResolver: ChatMessageBubbleTokenResolver = ({ themeTokens, semanticResolvers, config }) => {
  const { color, spacing, shape, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const isOutgoing = config.direction === 'outgoing'
  const alignment = resolveAlignment(config.direction)
  const messageCorners = resolveMessageCorners(themeTokens, config.direction)
  const bubbleColors = isOutgoing ? color.primary : color.neutral
  const messageDescriptionColor = semanticResolvers.asDescription({ themeTokens, color: bubbleColors.onColor })

  return {
    container: {
      size: {
        maxWidth: bubbleMaxWidth,
      },
      layout: {
        gap: spacing.sm,
        direction: 'vertical',
        alignSelf: alignment,
        crossAxisAligment: alignment,
      },
    },
    bubble: {
      backgroundColor: bubbleColors.color,
      shape: {
        borderRadius: messageCorners,
      },
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xxl,
        horizontal: spacing.lg,
      },
      layout: {
        gap: spacing.sm,
        direction: 'vertical'
      },
    },
    content: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.light,
      color: bubbleColors.onColor,
    },
    timestamp: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: messageDescriptionColor,
      textAlign: 'right',
    },
    receipt: {
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: spacing.sm,
      },
    },
    receiptText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: descriptionColor,
    },
    receiptIcon: {
      color: color.primary.color,
    },
  }
}
