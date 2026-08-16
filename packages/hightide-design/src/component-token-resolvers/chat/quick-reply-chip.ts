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
  const { color, spacing, shape, borderWidth, typography } = themeTokens
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
        vertical: shape.padding.md,
        horizontal: spacing.lg,
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
        crossAxisAligment: 'center',
        alignSelf: 'start',
        gap: shape.padding.md,
      },
    },
    stateLayer: {
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
      },
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: isActive ? color.primary.color : descriptionColor,
    },
  }
}
