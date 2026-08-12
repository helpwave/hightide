import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor,
  resolveHoverColor
} from './shared'

export type ChatConversationRowState = {
  isPressed?: boolean,
  isDisabled?: boolean,
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowComponentResolverProps = {
  state: ChatConversationRowState,
}

export type ChatConversationRowTokens = {
  container: ContainerTokens,
  title: TextStyleTokens,
  timestamp: TextStyleTokens,
  preview: TextStyleTokens,
  unreadBadge: ContainerTokens,
  unreadBadgeText: TextStyleTokens,
  sentIndicator: IconTokens,
}

export type ChatConversationRowTokenResolver = ComponentTokenResolver<
  ChatConversationRowComponentResolverProps,
  ChatConversationRowTokens
>

export const chatConversationRowTokenResolver: ChatConversationRowTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const hoverColor = resolveHoverColor({ themeTokens })
  const isPressed = !!state.isPressed && !state.isDisabled

  return {
    container: {
      backgroundColor: state.isSelected
        ? color.background.color
        : isPressed ? hoverColor : 'transparent',
      size: {
        width: '100%',
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
        padding: {
          vertical: shape.padding.xxl,
          horizontal: spacing.lg,
        },
      },
      border: {
        width: {
          type: 'physicalSide',
          left: state.isSelected ? borders.borderWidths.thick : 0,
        },
        color: {
          type: 'physicalSide',
          left: state.isSelected ? color.primary.color : 'transparent',
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xxl,
      },
    },
    title: {
      ...typography.body.md,
      fontWeight: state.isUnread ? typography.fontWeights.bold : typography.fontWeights.medium,
      color: color.surface.onColor,
      flex: 1,
    },
    timestamp: {
      ...typography.body.sm,
      fontWeight: state.isUnread ? typography.fontWeights.medium : typography.fontWeights.base,
      color: state.isUnread ? color.primary.color : descriptionColor,
      flexShrink: 0,
    },
    preview: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.light,
      color: state.isUnread ? color.surface.onColor : descriptionColor,
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: color.primary.color,
      size: {
        minWidth: spacing.lg + spacing.sm,
        height: spacing.lg + spacing.sm,
      },
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
        padding: {
          horizontal: shape.padding.md,
        },
      },
      layout: {
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    unreadBadgeText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.bold,
      color: color.primary.onColor,
    },
    sentIndicator: {
      color: color.primary.color,
    },
  }
}
