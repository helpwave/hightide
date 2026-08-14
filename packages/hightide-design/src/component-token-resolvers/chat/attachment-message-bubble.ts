import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  type ChatMessageBubbleTokens
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
  contentContainer: {
    config: Partial<PressableComponentResolverProps['overrides']>,
  } & Partial<PressableTokens>,
  fileIconContainer: ContainerTokens,
  fileIcon: IconTokens,
  downloadIcon: IconTokens,
  fileNameText: TextStyleTokens,
  fileMetadataText: TextStyleTokens,
}

export type ChatAttachmentMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatAttachmentMessageBubbleResolverProps,
  ChatAttachmentMessageBubbleTokens
>

export const chatAttachmentMessageBubbleTokenResolver: ChatAttachmentMessageBubbleTokenResolver = ({
  themeTokens,
  config,
}) => {
  const { color, size, spacing, shape, typography, icongraphy } = themeTokens
  const isOutgoing = config.direction === 'outgoing'

  return {
    chatMessageBubbleOverrides: {},
    contentContainer: {
      config: {
        coloringStyle: 'filled',
        coloringColorVariant: 'tonal',
        color: isOutgoing ? color.primary : color.neutral,
      },
      container: {
        layout: {
          direction: 'horizontal',
          crossAxisAligment: 'center',
          gap: spacing.md,
          alignSelf: 'stretch',
        },
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
    downloadIcon: {
      size: icongraphy.sizes.md,
      strokeWidth: icongraphy.strokeWidth,
    },
    fileNameText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
    },
    fileMetadataText: {
      ...typography.body.sm,
    },
  }
}
