import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor,
  resolveHoverColor,
  type ChatIconTokens
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

export type ChatConversationRowContainerTokens = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  width: '100%',
  paddingVertical: number,
  paddingHorizontal: number,
  backgroundColor: ColorToken,
  borderLeftWidth: number,
  borderLeftColor: ColorToken,
  borderRadius: number,
}

export type ChatUnreadBadgeTokens = {
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: number,
  height: number,
  paddingHorizontal: number,
  borderRadius: number,
  backgroundColor: ColorToken,
}

export type ChatConversationRowTokens = {
  container: ChatConversationRowContainerTokens,
  title: TextStyleTokens & { flex: number },
  timestamp: TextStyleTokens & { flexShrink: number },
  preview: TextStyleTokens & { flex: number },
  unreadBadge: ChatUnreadBadgeTokens,
  unreadBadgeText: TextStyleTokens,
  sentIndicator: ChatIconTokens,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xxl,
      width: '100%',
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: state.isSelected
        ? color.background.color
        : isPressed ? hoverColor : 'transparent',
      borderLeftWidth: state.isSelected ? borders.borderWidths.thick : 0,
      borderLeftColor: state.isSelected ? color.primary.color : 'transparent',
      borderRadius: shape.borderRadius.sm,
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
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: spacing.lg + spacing.sm,
      height: spacing.lg + spacing.sm,
      paddingHorizontal: shape.padding.md,
      borderRadius: pillBorderRadius,
      backgroundColor: color.primary.color,
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
