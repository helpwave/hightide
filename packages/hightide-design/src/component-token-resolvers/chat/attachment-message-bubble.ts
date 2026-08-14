import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  type ChatMessageBubbleTokens,
} from './message-bubble'
import {
  type ChatMessageDirection
} from './shared'

export type ChatAttachmentMessageBubbleResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatAttachmentMessageBubbleTokens = {
  chatMessageBubbleOverrides: Partial<ChatMessageBubbleTokens>,
  contentContainer: ContainerTokens,
  fileIconContainer: ContainerTokens,
  fileIcon: IconTokens,
  fileNameText: TextStyleTokens,
  fileMetadataText: TextStyleTokens,
}

export type ChatAttachmentMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatAttachmentMessageBubbleResolverProps,
  ChatAttachmentMessageBubbleTokens
>

export const chatAttachmentMessageBubbleTokenResolver: ChatAttachmentMessageBubbleTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
}) => {
  const { color, size, spacing, shape, typography, icongraphy } = themeTokens
  const isOutgoing = config.direction === 'outgoing'
  const bubbleColors = isOutgoing ? color.primary : color.surface
  const messageDescriptionColor = semanticResolvers.asDescription({
    themeTokens,
    color: bubbleColors.onColor,
  })

  return {
    chatMessageBubbleOverrides: {},
    contentContainer: {
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: spacing.md,
        alignSelf: 'stretch',
      },
    },
    fileIconContainer: {
      backgroundColor: HexColorUtils.hexWithAlpha(color.negative.color, 0.2),
      size: {
        width: size.md,
        height: size.md,
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
      },
      layout: {
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    fileIcon: {
      size: icongraphy.sizes.md,
      strokeWidth: icongraphy.strokeWidth,
      color: color.negative.color,
    },
    fileNameText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: bubbleColors.onColor,
    },
    fileMetadataText: {
      ...typography.body.sm,
      color: messageDescriptionColor,
    },
  }
}
