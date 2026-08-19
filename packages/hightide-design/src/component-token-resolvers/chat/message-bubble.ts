import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  bubbleMaxWidth,
  resolveAlignment,
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
  body: ContainerTokens,
  bodyText: TextStyleTokens,
  metaDataContainer: ContainerTokens,
  metaDataStatusContainer: ContainerTokens,
  metaDataText: TextStyleTokens,
  metaDataIcon: IconTokens,
}

export type ChatMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatMessageBubbleComponentResolverProps,
  ChatMessageBubbleTokens
>

export const chatMessageBubbleTokenResolver: ChatMessageBubbleTokenResolver = ({ themeTokens, semanticResolvers, config }) => {
  const { color, spacing, shape, typography, icongraphy } = themeTokens
  const isOutgoing = config.direction === 'outgoing'
  const alignment = resolveAlignment(config.direction)
  const messageCorners = resolveMessageCorners(themeTokens, config.direction)
  const bubbleColors = isOutgoing ? color.primary : color.surface
  const messageDescriptionColor = semanticResolvers.asDescription({ themeTokens, color: bubbleColors.onColor })

  return {
    container: {
      backgroundColor: bubbleColors.color,
      size: {
        maxWidth: bubbleMaxWidth,
      },
      shape: {
        borderRadius: messageCorners,
      },
      padding: {
        type: 'physicalSide',
        left: shape.padding.xl,
        right: shape.padding.xl,
        top: shape.padding.lg,
        bottom: shape.padding.md,
      },
      layout: {
        gap: spacing.sm,
        direction: 'vertical',
        selfCrossAxisAlignment: alignment,
      },
      decoration: {
        shadow: themeTokens.elevation.level1,
      },
    },
    body: {
      layout: {
        direction: 'vertical',
      },
    },
    bodyText: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.light,
      color: bubbleColors.onColor,
    },
    metaDataContainer: {
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'end',
        crossAxisAligment: 'center',
        gap: spacing.md,
        selfCrossAxisAlignment: 'end',
      },
    },
    metaDataStatusContainer: {
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: spacing.xs,
      },
    },
    metaDataText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: messageDescriptionColor,
    },
    metaDataIcon: {
      size: icongraphy.sizes.xs,
      strokeWidth: icongraphy.strokeWidth,
      color: messageDescriptionColor,
    },
  }
}
