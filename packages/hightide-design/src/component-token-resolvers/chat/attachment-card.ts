import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  bubbleMaxWidth,
  resolveAlignment,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveMessageCorners,
  type ChatMessageDirection
} from './shared'

export type ChatAttachmentCardResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatAttachmentCardTokens = {
  container: ContainerTokens,
  icon: ContainerTokens,
  iconColor: IconTokens,
  name: TextStyleTokens,
  metadata: TextStyleTokens,
}

export type ChatAttachmentCardTokenResolver = ComponentTokenResolver<
  ChatAttachmentCardResolverProps,
  ChatAttachmentCardTokens
>

export const chatAttachmentCardTokenResolver: ChatAttachmentCardTokenResolver = ({ themeTokens, semanticResolvers, config }) => {
  const { color, size, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const alignment = resolveAlignment(config.direction)
  const messageCorners = resolveMessageCorners(themeTokens, config.direction)
  const hairline = borders.borderWidths.thin

  return {
    container: {
      backgroundColor: color.surface.color,
      size: {
        maxWidth: bubbleMaxWidth,
      },
      shape: {
        borderRadius: messageCorners,
      },
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xxl,
        horizontal: shape.padding.xxl,
      },
      border: {
        width: {
          type: 'all',
          value: hairline,
        },
        color: {
          type: 'all',
          value: fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xxl,
        alignSelf: alignment,
      },
    },
    icon: {
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
    iconColor: {
      color: color.negative.color,
    },
    name: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: color.surface.onColor,
    },
    metadata: {
      ...typography.body.sm,
      color: descriptionColor,
    },
  }
}
