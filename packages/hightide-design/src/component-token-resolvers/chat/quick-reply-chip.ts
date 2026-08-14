import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveHoverColor
} from './shared'

export type ChatQuickReplyChipState = {
  isPressed?: boolean,
  isDisabled?: boolean,
  isActive?: boolean,
}

export type ChatQuickReplyChipComponentResolverProps = {
  state: ChatQuickReplyChipState,
}

export type ChatQuickReplyChipTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export type ChatQuickReplyChipTokenResolver = ComponentTokenResolver<
  ChatQuickReplyChipComponentResolverProps,
  ChatQuickReplyChipTokens
>

export const chatQuickReplyChipTokenResolver: ChatQuickReplyChipTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borderWidth, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const hoverColor = resolveHoverColor({ themeTokens })
  const isPressed = !!state.isPressed && !state.isDisabled
  const hairline = borderWidth.thin

  return {
    container: {
      backgroundColor: isPressed ? hoverColor : color.surface.color,
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
          value: state.isActive ? color.primary.color : fadedBorder,
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        alignSelf: 'start',
        gap: shape.padding.md,
      },
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: state.isActive ? color.primary.color : descriptionColor,
    },
  }
}
