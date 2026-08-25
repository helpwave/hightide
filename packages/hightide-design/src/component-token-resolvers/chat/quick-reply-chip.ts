import type { ComponentTokenResolver } from '../component-token-resolver'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatQuickReplyChipComponentResolverProps = {
  config: {
    isActive?: boolean,
  },
}

export type ChatQuickReplyChipTokens = {
  config: Partial<PressableComponentResolverProps['overrides']>,
} & Partial<PressableTokens>

export type ChatQuickReplyChipTokenResolver = ComponentTokenResolver<
  ChatQuickReplyChipComponentResolverProps,
  ChatQuickReplyChipTokens
>

export const chatQuickReplyChipTokenResolver: ChatQuickReplyChipTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
}) => {
  const { color, padding, borderWidth, typography, fontWeights } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const isActive = !!config.isActive
  const hairline = borderWidth.thin

  return {
    config: {
      coloringStyle: 'filled',
      coloringColorVariant: 'normal',
      color: color.surface,
      size: 'sm',
    },
    container: {
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: padding.md,
        horizontal: padding.lg,
      },
      border: {
        width: {
          type: 'all',
          value: hairline,
        },
        color: {
          type: 'all',
          value: isActive ? color.primary.color : fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: padding.md,
      },
    },
    stateLayer: {
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
      },
    },
    text: {
      ...typography.body.sm,
      fontWeight: fontWeights.medium,
      color: isActive ? color.primary.color : descriptionColor,
    },
  }
}
