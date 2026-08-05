import { HexColorUtils } from '../../utils/hex'
import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  bubbleMaxWidth,
  resolveAlignment,
  resolveDescriptionColor,
  resolveMessageCorners,
  type ChatCornerRadiusTokens,
  type ChatIconTokens,
  type ChatMessageDirection,
  type ChatAlignment
} from './shared'

export type ChatMessageBubbleComponentResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatMessageBubbleTokens = {
  container: {
    maxWidth: number,
    gap: number,
    alignSelf: ChatAlignment,
    alignItems: ChatAlignment,
  },
  bubble: ChatCornerRadiusTokens & {
    paddingVertical: number,
    paddingHorizontal: number,
    backgroundColor: ColorToken,
  },
  content: TextStyleTokens,
  timestamp: TextStyleTokens & {
    marginTop: number,
    textAlign: 'right',
  },
  receipt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
  },
  receiptText: TextStyleTokens,
  receiptIcon: ChatIconTokens,
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

  return {
    container: {
      maxWidth: bubbleMaxWidth,
      gap: spacing.sm,
      alignSelf: alignment,
      alignItems: alignment,
    },
    bubble: {
      ...messageCorners,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: bubbleColors.color,
    },
    content: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.light,
      color: bubbleColors.onColor,
    },
    timestamp: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: isOutgoing
        ? HexColorUtils.hexWithAlpha(color.primary.onColor, 0.75)
        : descriptionColor,
      marginTop: spacing.sm,
      textAlign: 'right',
    },
    receipt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
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
