import { HexColorUtils } from '../../utils/hex'
import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  bubbleMaxWidth,
  resolveAlignment,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveMessageCorners,
  type ChatCornerRadiusTokens,
  type ChatIconTokens,
  type ChatMessageDirection,
  type ChatAlignment
} from './shared'

export type ChatAttachmentCardResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatAttachmentCardTokens = {
  container: ChatCornerRadiusTokens & {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
    maxWidth: number,
    padding: number,
    backgroundColor: ColorToken,
    borderWidth: number,
    borderColor: ColorToken,
    alignSelf: ChatAlignment,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: number,
    height: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  iconColor: ChatIconTokens,
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
      ...messageCorners,
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xxl,
      maxWidth: bubbleMaxWidth,
      padding: shape.padding.xxl,
      backgroundColor: color.surface.color,
      borderWidth: hairline,
      borderColor: fadedBorder,
      alignSelf: alignment,
    },
    icon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size.md,
      height: size.md,
      borderRadius: shape.borderRadius.sm,
      backgroundColor: HexColorUtils.hexWithAlpha(color.negative.color, 0.2),
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
