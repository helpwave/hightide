import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createColorSchemeTokensFromThemeTokens } from '../theme-tokens/color-scheme'
import type { ColoringType } from '../theme-tokens/color-scheme'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatState = {
  direction?: ChatMessageDirection,
  color?: ColoringType,
  isPressed?: boolean,
  isDisabled?: boolean,
  isUnread?: boolean,
  isSelected?: boolean,
  isActive?: boolean,
}

export type ChatAlignment = 'flex-start' | 'flex-end'

export type ChatIconTokens = {
  color: ColorToken,
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

export type ChatConversationListTokens = {
  container: {
    flex: number,
    backgroundColor: ColorToken,
  },
  header: {
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
  },
  footer: {
    paddingVertical: number,
    paddingHorizontal: number,
  },
}

export type ChatThreadHeaderTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderBottomWidth: number,
    borderBottomColor: ColorToken,
    backgroundColor: ColorToken,
  },
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
}

export type ChatMessageListTokens = {
  container: {
    flex: number,
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
    backgroundColor: ColorToken,
  },
}

export type ChatCornerRadiusTokens = {
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
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

export type ChatMessageCardTokens = {
  container: ChatCornerRadiusTokens & {
    width: number,
    maxWidth: number,
    backgroundColor: ColorToken,
    borderWidth: number,
    borderColor: ColorToken,
    overflow: 'hidden',
    alignSelf: ChatAlignment,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderBottomWidth: number,
    borderBottomColor: ColorToken,
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
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
  body: {
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
  },
  actions: {
    flexDirection: 'row',
    gap: number,
    paddingHorizontal: number,
    paddingBottom: number,
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

export type ChatSystemLineTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: number,
  },
  text: TextStyleTokens,
  icon: ChatIconTokens,
}

export type ChatDateDividerTokens = {
  container: {
    alignSelf: 'center',
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  text: TextStyleTokens,
}

export type ChatQuickReplyChipTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    borderWidth: number,
    borderColor: ColorToken,
    backgroundColor: ColorToken,
  },
  text: TextStyleTokens,
}

export type ChatMessageComposerTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    backgroundColor: ColorToken,
    borderTopWidth: number,
    borderTopColor: ColorToken,
  },
  input: TextStyleTokens & {
    flex: number,
    minHeight: number,
    maxHeight: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  placeholderColor: ColorToken,
}

export type ChatThemeTokens = {
  conversationRow: ChatConversationRowTokens,
  conversationList: ChatConversationListTokens,
  threadHeader: ChatThreadHeaderTokens,
  messageList: ChatMessageListTokens,
  messageBubble: ChatMessageBubbleTokens,
  messageCard: ChatMessageCardTokens,
  attachmentCard: ChatAttachmentCardTokens,
  systemLine: ChatSystemLineTokens,
  dateDivider: ChatDateDividerTokens,
  quickReplyChip: ChatQuickReplyChipTokens,
  messageComposer: ChatMessageComposerTokens,
}

const pillBorderRadius = 999
const bubbleMaxWidth = 280
const messageCardWidth = 290
const messageCardMaxWidth = 300
const composerMaxLines = 7

export const hightideChatTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  ChatState,
  ChatThemeTokens
> = ({ themeTokens, state }) => {
  const { color, size, spacing, shape, borders, typography } = themeTokens
  const colorSchemes = createColorSchemeTokensFromThemeTokens(themeTokens)
  const accent = colorSchemes[state.color ?? 'primary']
  const isOutgoing = state.direction === 'outgoing'
  const isPressed = !!state.isPressed && !state.isDisabled
  const alignment: ChatAlignment = isOutgoing ? 'flex-end' : 'flex-start'
  const radius = shape.borderRadius.lg
  const corner = shape.borderRadius.xs
  const hairline = borders.borderWidths.thin

  const messageCorners: ChatCornerRadiusTokens = {
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: isOutgoing ? radius : corner,
    borderBottomRightRadius: isOutgoing ? corner : radius,
  }

  const bubbleColors = isOutgoing ? color.primary : color.neutral

  return {
    conversationRow: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: shape.padding.xxl,
        width: '100%',
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: spacing.lg,
        backgroundColor: state.isSelected
          ? color.background
          : isPressed ? color.surfaceHover : color.transparent,
        borderLeftWidth: state.isSelected ? borders.borderWidths.thick : 0,
        borderLeftColor: state.isSelected ? color.primary.color : color.transparent,
        borderRadius: shape.borderRadius.sm,
      },
      title: {
        ...typography.body.md,
        fontWeight: state.isUnread ? typography.fontWeights.bold : typography.fontWeights.medium,
        color: color.onSurface,
        flex: 1,
      },
      timestamp: {
        ...typography.body.sm,
        fontWeight: state.isUnread ? typography.fontWeights.medium : typography.fontWeights.base,
        color: state.isUnread ? color.primary.color : color.description,
        flexShrink: 0,
      },
      preview: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.light,
        color: state.isUnread ? color.onSurface : color.description,
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
    },
    conversationList: {
      container: {
        flex: 1,
        backgroundColor: color.surface,
      },
      header: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        gap: shape.padding.xxl,
      },
      footer: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
    },
    threadHeader: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: shape.padding.xxl,
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: hairline,
        borderBottomColor: color.divider,
        backgroundColor: color.surface,
      },
      title: {
        ...typography.body.md,
        fontWeight: typography.fontWeights.bold,
        color: color.onSurface,
      },
      subtitle: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.light,
        color: color.description,
      },
    },
    messageList: {
      container: {
        flex: 1,
        paddingVertical: spacing.lg + spacing.xs,
        paddingHorizontal: spacing.lg,
        gap: shape.padding.xxl,
        backgroundColor: color.background,
      },
    },
    messageBubble: {
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
          : color.description,
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
        color: color.description,
      },
      receiptIcon: {
        color: color.primary.color,
      },
    },
    messageCard: {
      container: {
        ...messageCorners,
        width: messageCardWidth,
        maxWidth: messageCardMaxWidth,
        backgroundColor: color.surface,
        borderWidth: hairline,
        borderColor: color.divider,
        overflow: 'hidden',
        alignSelf: alignment,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: shape.padding.xl,
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: hairline,
        borderBottomColor: color.divider,
      },
      icon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size.xs + spacing.md,
        height: size.xs + spacing.md,
        borderRadius: shape.borderRadius.sm,
        backgroundColor: accent.tonal.base.color,
      },
      iconColor: {
        color: accent.tonal.base.foreground,
      },
      title: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.bold,
        color: accent.text.base.foreground,
      },
      subtitle: {
        ...typography.body.sm,
        color: color.description,
      },
      body: {
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
      },
      actions: {
        flexDirection: 'row',
        gap: shape.padding.xl,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
      },
    },
    attachmentCard: {
      container: {
        ...messageCorners,
        flexDirection: 'row',
        alignItems: 'center',
        gap: shape.padding.xxl,
        maxWidth: bubbleMaxWidth,
        padding: shape.padding.xxl,
        backgroundColor: color.surface,
        borderWidth: hairline,
        borderColor: color.divider,
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
        color: color.onSurface,
      },
      metadata: {
        ...typography.body.sm,
        color: color.description,
      },
    },
    systemLine: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        gap: shape.padding.md,
      },
      text: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.medium,
        color: accent.text.base.foreground,
      },
      icon: {
        color: accent.text.base.foreground,
      },
    },
    dateDivider: {
      container: {
        alignSelf: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: pillBorderRadius,
        backgroundColor: color.surface,
      },
      text: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.medium,
        color: color.description,
      },
    },
    quickReplyChip: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: shape.padding.md,
        paddingVertical: shape.padding.md,
        paddingHorizontal: spacing.lg,
        borderRadius: pillBorderRadius,
        borderWidth: hairline,
        borderColor: state.isActive ? color.primary.color : color.divider,
        backgroundColor: isPressed ? color.surfaceHover : color.surface,
      },
      text: {
        ...typography.body.sm,
        fontWeight: typography.fontWeights.medium,
        color: state.isActive ? color.primary.color : color.description,
      },
    },
    messageComposer: {
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        gap: spacing.md,
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: spacing.lg,
        backgroundColor: color.surface,
        borderTopWidth: hairline,
        borderTopColor: color.divider,
      },
      input: {
        ...typography.body.md,
        flex: 1,
        minHeight: size.md,
        maxHeight: size.md * composerMaxLines,
        paddingVertical: shape.padding.xxl,
        paddingHorizontal: shape.padding.xxl,
        borderRadius: shape.borderRadius.sm,
        backgroundColor: color.surfaceVariant,
        color: color.onSurface,
      },
      placeholderColor: color.placeholder,
    },
  }
}
