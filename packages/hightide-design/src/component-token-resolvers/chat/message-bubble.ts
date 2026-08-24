import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
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
  const { color, spacing, padding, typography, fontWeights, icongraphy } = themeTokens
  const isOutgoing = config.direction === 'outgoing'
  const alignment = resolveAlignment(config.direction)
  const messageCorners = resolveMessageCorners(themeTokens, config.direction)
  const bubbleColors = isOutgoing ? color.primary : color.surface
  const messageDescriptionColor = semanticResolvers.asDescription({
    themeTokens,
    colorPair: bubbleColors,
  })

  return {
    container: {
      backgroundColor: bubbleColors.color,
      size: {
        maxWidth: semanticResolvers.containerLayout({ themeTokens, size: 'md' }).size * 16
      },
      shape: {
        borderRadius: messageCorners,
      },
      padding: {
        type: 'physicalSide',
        left: padding.xl,
        right: padding.xl,
        top: padding.lg,
        bottom: padding.md,
      },
      margin: isOutgoing ? {
        type: 'logicalSide',
        inlineStart: themeTokens.spacing.xxl,
      } : {
        type: 'logicalSide',
        inlineEnd: themeTokens.spacing.xxl,
      } ,
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
      fontWeight: fontWeights.light,
      color: bubbleColors.onColor,
    },
    metaDataContainer: {
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'end',
        crossAxisAlignment: 'center',
        gap: spacing.md,
        selfCrossAxisAlignment: 'end',
      },
    },
    metaDataStatusContainer: {
      layout: {
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: spacing.xs,
      },
    },
    metaDataText: {
      ...typography.body.sm,
      fontWeight: fontWeights.medium,
      color: messageDescriptionColor,
    },
    metaDataIcon: {
      size: icongraphy.sizes.xs,
      strokeWidth: icongraphy.strokeWidth,
      color: messageDescriptionColor,
    },
  }
}
