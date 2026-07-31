import {
  StyleSheet,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

import type { Color } from '../types/color'
import type {
  ChatAttachmentCardState,
  ChatAttachmentCardTheme,
  ChatConversationListTheme,
  ChatConversationRowState,
  ChatConversationRowTheme,
  ChatDateDividerTheme,
  ChatMessageBubbleState,
  ChatMessageBubbleTheme,
  ChatMessageCardState,
  ChatMessageCardTheme,
  ChatMessageComposerTheme,
  ChatMessageListTheme,
  ChatQuickReplyChipState,
  ChatQuickReplyChipTheme,
  ChatSystemLineState,
  ChatSystemLineTheme,
  ChatTheme,
  ChatThreadHeaderTheme
} from '../types/components/chat'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export const createChatConversationRowContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, colorSchemes } = theme

  return createStyleResolver((state: ChatConversationRowState): ViewStyle => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: state.isSelected
        ? colors.background
        : pressed
          ? colors.surfaceHover
          : colors.transparent,
      borderLeftWidth: state.isSelected ? 4 : 0,
      borderLeftColor: state.isSelected ? colorSchemes.primary.filled.base.color : colors.transparent,
      borderRadius: 6,
    }
  })
}

export const createChatConversationRowTitleTheme = (theme: HightideDesignSystemTokens) => {
  const { colors } = theme

  return createStyleResolver((state: ChatConversationRowState): TextStyle => ({
    flex: 1,
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: state.isUnread ? hightideTypography.fontWeight.bold : hightideTypography.fontWeight.medium,
  }))
}

export const createChatConversationRowTimestampTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, colorSchemes } = theme

  return createStyleResolver((state: ChatConversationRowState): TextStyle => ({
    color: state.isUnread ? colorSchemes.primary.text.base.foreground : colors.description,
    fontSize: 12,
    fontWeight: state.isUnread ? hightideTypography.fontWeight.medium : hightideTypography.fontWeight.base,
    flexShrink: 0,
  }))
}

export const createChatConversationRowPreviewTheme = (theme: HightideDesignSystemTokens) => {
  const { colors } = theme

  return createStyleResolver((state: ChatConversationRowState): TextStyle => ({
    flex: 1,
    color: state.isUnread ? colors.onSurface : colors.description,
    fontSize: 14,
    fontWeight: hightideTypography.fontWeight.light,
  }))
}

export const createChatConversationRowUnreadBadgeTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme

  return createStyleResolver((): ViewStyle => ({
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: colorSchemes.primary.filled.base.color,
    alignItems: 'center',
    justifyContent: 'center',
  }))
}

export const createChatConversationRowUnreadBadgeTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme

  return createStyleResolver((): TextStyle => ({
    color: colorSchemes.primary.filled.base.foreground,
    fontSize: 11,
    fontWeight: hightideTypography.fontWeight.bold,
  }))
}

export const createChatConversationRowSentIndicatorTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes } = theme

  return createValueResolver((): { color: Color } => ({
    color: colorSchemes.primary.text.base.foreground,
  }))
}

export const createChatConversationRowTheme = (
  theme: HightideDesignSystemTokens
): ChatConversationRowTheme => ({
  container: createChatConversationRowContainerTheme(theme),
  title: createChatConversationRowTitleTheme(theme),
  timestamp: createChatConversationRowTimestampTheme(theme),
  preview: createChatConversationRowPreviewTheme(theme),
  unreadBadge: createChatConversationRowUnreadBadgeTheme(theme),
  unreadBadgeText: createChatConversationRowUnreadBadgeTextTheme(theme),
  sentIndicator: createChatConversationRowSentIndicatorTheme(theme),
})

export const createChatConversationListTheme = (
  theme: HightideDesignSystemTokens
): ChatConversationListTheme => {
  const { colors } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      flex: 1,
      backgroundColor: colors.surface,
    })),
    header: createStyleResolver((): ViewStyle => ({
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 12,
    })),
    footer: createStyleResolver((): ViewStyle => ({
      paddingHorizontal: 14,
      paddingVertical: 8,
    })),
  }
}

export const createChatThreadHeaderTheme = (
  theme: HightideDesignSystemTokens
): ChatThreadHeaderTheme => {
  const { colors } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      backgroundColor: colors.surface,
    })),
    title: createStyleResolver((): TextStyle => ({
      color: colors.onSurface,
      fontSize: 16,
      fontWeight: hightideTypography.fontWeight.bold,
    })),
    subtitle: createStyleResolver((): TextStyle => ({
      color: colors.description,
      fontSize: 12,
      fontWeight: hightideTypography.fontWeight.light,
    })),
  }
}

export const createChatMessageListTheme = (
  theme: HightideDesignSystemTokens
): ChatMessageListTheme => {
  const { colors } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 18,
      gap: 12,
      backgroundColor: colors.background,
    })),
  }
}

export const createChatMessageBubbleTheme = (
  theme: HightideDesignSystemTokens
): ChatMessageBubbleTheme => {
  const { colors, colorSchemes } = theme

  return {
    container: createStyleResolver((state: ChatMessageBubbleState): ViewStyle => ({
      maxWidth: 280,
      gap: 4,
      alignSelf: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
      alignItems: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
    })),
    bubble: createStyleResolver((state: ChatMessageBubbleState): ViewStyle => {
      const outgoing = state.direction === 'outgoing'
      const radius = 12
      const corner = 4

      return {
        paddingHorizontal: 15,
        paddingVertical: 11,
        backgroundColor: outgoing
          ? colorSchemes.primary.filled.base.color
          : colorSchemes.neutral.filled.base.color,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: outgoing ? radius : corner,
        borderBottomRightRadius: outgoing ? corner : radius,
      }
    }),
    content: createStyleResolver((state: ChatMessageBubbleState): TextStyle => ({
      color: state.direction === 'outgoing'
        ? colorSchemes.primary.filled.base.foreground
        : colorSchemes.neutral.filled.base.foreground,
      fontSize: 16,
      fontWeight: hightideTypography.fontWeight.light,
      lineHeight: 22.4,
    })),
    timestamp: createStyleResolver((state: ChatMessageBubbleState): TextStyle => ({
      marginTop: 5,
      color: state.direction === 'outgoing'
        ? HexColorUtils.hexWithAlpha(colorSchemes.primary.filled.base.foreground, 0.75)
        : colors.description,
      fontSize: 11,
      fontWeight: hightideTypography.fontWeight.medium,
      textAlign: 'right',
    })),
    receipt: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    })),
    receiptText: createStyleResolver((): TextStyle => ({
      color: colors.description,
      fontSize: 11,
      fontWeight: hightideTypography.fontWeight.medium,
    })),
    receiptIcon: createValueResolver((): { color: Color } => ({
      color: colorSchemes.primary.text.base.foreground,
    })),
  }
}

export const createChatMessageCardTheme = (
  theme: HightideDesignSystemTokens
): ChatMessageCardTheme => {
  const { colors, colorSchemes } = theme

  return {
    container: createStyleResolver((state: ChatMessageCardState): ViewStyle => {
      const outgoing = state.direction === 'outgoing'
      const radius = 12
      const corner = 4

      return {
        width: 290,
        maxWidth: 300,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: outgoing ? radius : corner,
        borderBottomRightRadius: outgoing ? corner : radius,
        overflow: 'hidden',
        alignSelf: outgoing ? 'flex-end' : 'flex-start',
      }
    }),
    header: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    })),
    icon: createStyleResolver((state: ChatMessageCardState): ViewStyle => {
      const color = state.color ?? 'primary'
      const tonal = colorSchemes[color].tonal.base

      return {
        width: 36,
        height: 36,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tonal.color,
      }
    }),
    iconColor: createValueResolver((state: ChatMessageCardState): { color: Color } => {
      const color = state.color ?? 'primary'

      return {
        color: colorSchemes[color].tonal.base.foreground,
      }
    }),
    title: createStyleResolver((state: ChatMessageCardState): TextStyle => {
      const color = state.color ?? 'primary'

      return {
        color: colorSchemes[color].text.base.foreground,
        fontSize: 14,
        fontWeight: hightideTypography.fontWeight.bold,
      }
    }),
    subtitle: createStyleResolver((): TextStyle => ({
      color: colors.description,
      fontSize: 12,
    })),
    body: createStyleResolver((): ViewStyle => ({
      paddingHorizontal: 15,
      paddingVertical: 12,
      gap: 4,
    })),
    actions: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 15,
      paddingBottom: 15,
    })),
  }
}

export const createChatAttachmentCardTheme = (
  theme: HightideDesignSystemTokens
): ChatAttachmentCardTheme => {
  const { colors, colorSchemes } = theme

  return {
    container: createStyleResolver((state: ChatAttachmentCardState): ViewStyle => {
      const outgoing = state.direction === 'outgoing'
      const radius = 12
      const corner = 4

      return {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        maxWidth: 280,
        padding: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: outgoing ? radius : corner,
        borderBottomRightRadius: outgoing ? corner : radius,
        alignSelf: outgoing ? 'flex-end' : 'flex-start',
      }
    }),
    icon: createStyleResolver((): ViewStyle => ({
      width: 44,
      height: 44,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: HexColorUtils.hexWithAlpha(colorSchemes.negative.filled.base.color, 0.2),
    })),
    iconColor: createValueResolver((): { color: Color } => ({
      color: colorSchemes.negative.text.base.foreground,
    })),
    name: createStyleResolver((): TextStyle => ({
      color: colors.onSurface,
      fontSize: 14,
      fontWeight: hightideTypography.fontWeight.medium,
    })),
    metadata: createStyleResolver((): TextStyle => ({
      color: colors.description,
      fontSize: 12,
    })),
  }
}

export const createChatSystemLineTheme = (
  theme: HightideDesignSystemTokens
): ChatSystemLineTheme => {
  const { colorSchemes } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: 6,
    })),
    text: createStyleResolver((state: ChatSystemLineState): TextStyle => {
      const color = state.color ?? 'primary'

      return {
        color: colorSchemes[color].text.base.foreground,
        fontSize: 12,
        fontWeight: hightideTypography.fontWeight.medium,
      }
    }),
    icon: createValueResolver((state: ChatSystemLineState): { color: Color } => {
      const color = state.color ?? 'primary'

      return {
        color: colorSchemes[color].text.base.foreground,
      }
    }),
  }
}

export const createChatDateDividerTheme = (
  theme: HightideDesignSystemTokens
): ChatDateDividerTheme => {
  const { colors } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      alignSelf: 'center',
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: colors.surface,
    })),
    text: createStyleResolver((): TextStyle => ({
      color: colors.description,
      fontSize: 12,
      fontWeight: hightideTypography.fontWeight.medium,
    })),
  }
}

export const createChatQuickReplyChipTheme = (
  theme: HightideDesignSystemTokens
): ChatQuickReplyChipTheme => {
  const { colors, colorSchemes } = theme

  return {
    container: createStyleResolver((state: ChatQuickReplyChipState): ViewStyle => {
      const pressed = !!state.isPressed && !state.isDisabled

      return {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: state.isActive ? colorSchemes.primary.filled.base.color : colors.divider,
        backgroundColor: pressed ? colors.surfaceHover : colors.surface,
      }
    }),
    text: createStyleResolver((state: ChatQuickReplyChipState): TextStyle => ({
      color: state.isActive ? colorSchemes.primary.text.base.foreground : colors.description,
      fontSize: 14,
      fontWeight: hightideTypography.fontWeight.medium,
    })),
  }
}

export const createChatMessageComposerTheme = (
  theme: HightideDesignSystemTokens
): ChatMessageComposerTheme => {
  const { colors } = theme

  return {
    container: createStyleResolver((): ViewStyle => ({
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
    })),
    input: createStyleResolver((): TextStyle => ({
      flex: 1,
      minHeight: 44,
      maxHeight: 44 * 7,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 6,
      backgroundColor: colors.surfaceVariant,
      color: colors.onSurface,
      fontSize: 15,
    })),
    placeholderColor: createValueResolver((): Color => colors.placeholder),
  }
}

export const createChatTheme = (theme: HightideDesignSystemTokens): ChatTheme => ({
  conversationRow: createChatConversationRowTheme(theme),
  conversationList: createChatConversationListTheme(theme),
  threadHeader: createChatThreadHeaderTheme(theme),
  messageList: createChatMessageListTheme(theme),
  messageBubble: createChatMessageBubbleTheme(theme),
  messageCard: createChatMessageCardTheme(theme),
  attachmentCard: createChatAttachmentCardTheme(theme),
  systemLine: createChatSystemLineTheme(theme),
  dateDivider: createChatDateDividerTheme(theme),
  quickReplyChip: createChatQuickReplyChipTheme(theme),
  messageComposer: createChatMessageComposerTheme(theme),
})
