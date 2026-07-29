import {
  StyleSheet,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { ColorSchemes } from '@helpwave/hightide-design/theme'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

import type {
  Color,
  HightideSemanticColors
} from '../types/color'
import type {
  ChatAttachmentCardState,
  ChatConversationRowState,
  ChatMessageBubbleState,
  ChatMessageCardState,
  ChatQuickReplyChipState,
  ChatSystemLineState,
  ChatTheme
} from '../types/components/chat'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateChatThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: ColorSchemes,
}

export const createChatTheme = ({
  semantic,
  colorSchemes,
}: CreateChatThemeOptions): ChatTheme => {
  const resolveConversationRow = (state: ChatConversationRowState): ViewStyle => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: state.isSelected
        ? semantic.background
        : pressed
          ? semantic.surfaceHover
          : semantic.transparent,
      borderLeftWidth: state.isSelected ? 4 : 0,
      borderLeftColor: state.isSelected ? colorSchemes.primary.filled.base.background : semantic.transparent,
      borderRadius: 6,
    }
  }

  return {
    conversationRow: {
      container: createStyleResolver<ChatConversationRowState, ViewStyle>(resolveConversationRow),
      title: createStyleResolver<ChatConversationRowState, TextStyle>((state) => ({
        flex: 1,
        color: semantic.onSurface,
        fontSize: 16,
        fontWeight: state.isUnread ? hightideTypography.fontWeight.bold : hightideTypography.fontWeight.medium,
      })),
      timestamp: createStyleResolver<ChatConversationRowState, TextStyle>((state) => ({
        color: state.isUnread ? colorSchemes.primary.text.base.foreground : semantic.description,
        fontSize: 12,
        fontWeight: state.isUnread ? hightideTypography.fontWeight.medium : hightideTypography.fontWeight.base,
        flexShrink: 0,
      })),
      preview: createStyleResolver<ChatConversationRowState, TextStyle>((state) => ({
        flex: 1,
        color: state.isUnread ? semantic.onSurface : semantic.description,
        fontSize: 14,
        fontWeight: hightideTypography.fontWeight.light,
      })),
      unreadBadge: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        minWidth: 20,
        height: 20,
        paddingHorizontal: 6,
        borderRadius: 999,
        backgroundColor: colorSchemes.primary.filled.base.background,
        alignItems: 'center',
        justifyContent: 'center',
      })),
      unreadBadgeText: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: colorSchemes.primary.filled.base.foreground,
        fontSize: 11,
        fontWeight: hightideTypography.fontWeight.bold,
      })),
      sentIndicator: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: colorSchemes.primary.text.base.foreground,
      })),
    },
    conversationList: {
      container: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flex: 1,
        backgroundColor: semantic.surface,
      })),
      header: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 12,
      })),
      footer: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        paddingHorizontal: 14,
        paddingVertical: 8,
      })),
    },
    threadHeader: {
      container: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: semantic.divider,
        backgroundColor: semantic.surface,
      })),
      title: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.onSurface,
        fontSize: 16,
        fontWeight: hightideTypography.fontWeight.bold,
      })),
      subtitle: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 12,
        fontWeight: hightideTypography.fontWeight.light,
      })),
    },
    messageList: {
      container: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 18,
        gap: 12,
        backgroundColor: semantic.background,
      })),
    },
    messageBubble: {
      container: createStyleResolver<ChatMessageBubbleState, ViewStyle>((state) => ({
        maxWidth: 280,
        gap: 4,
        alignSelf: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
        alignItems: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
      })),
      bubble: createStyleResolver<ChatMessageBubbleState, ViewStyle>((state) => {
        const outgoing = state.direction === 'outgoing'
        const radius = 12
        const corner = 4

        return {
          paddingHorizontal: 15,
          paddingVertical: 11,
          backgroundColor: outgoing
            ? colorSchemes.primary.filled.base.background
            : colorSchemes.neutral.filled.base.background,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: outgoing ? radius : corner,
          borderBottomRightRadius: outgoing ? corner : radius,
        }
      }),
      content: createStyleResolver<ChatMessageBubbleState, TextStyle>((state) => ({
        color: state.direction === 'outgoing'
          ? colorSchemes.primary.filled.base.foreground
          : colorSchemes.neutral.filled.base.foreground,
        fontSize: 16,
        fontWeight: hightideTypography.fontWeight.light,
        lineHeight: 22.4,
      })),
      timestamp: createStyleResolver<ChatMessageBubbleState, TextStyle>((state) => ({
        marginTop: 5,
        color: state.direction === 'outgoing'
          ? HexColorUtils.hexWithAlpha(colorSchemes.primary.filled.base.foreground, 0.75)
          : semantic.description,
        fontSize: 11,
        fontWeight: hightideTypography.fontWeight.medium,
        textAlign: 'right',
      })),
      receipt: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      })),
      receiptText: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 11,
        fontWeight: hightideTypography.fontWeight.medium,
      })),
      receiptIcon: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: colorSchemes.primary.text.base.foreground,
      })),
    },
    messageCard: {
      container: createStyleResolver<ChatMessageCardState, ViewStyle>((state) => {
        const outgoing = state.direction === 'outgoing'
        const radius = 12
        const corner = 4

        return {
          width: 290,
          maxWidth: 300,
          backgroundColor: semantic.surface,
          borderWidth: 1,
          borderColor: semantic.divider,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: outgoing ? radius : corner,
          borderBottomRightRadius: outgoing ? corner : radius,
          overflow: 'hidden',
          alignSelf: outgoing ? 'flex-end' : 'flex-start',
        }
      }),
      header: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: semantic.divider,
      })),
      icon: createStyleResolver<ChatMessageCardState, ViewStyle>((state) => {
        const color = state.color ?? 'primary'
        const tonal = colorSchemes[color].tonal.base

        return {
          width: 36,
          height: 36,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tonal.background,
        }
      }),
      iconColor: createValueResolver<ChatMessageCardState, { color: Color }>((state) => {
        const color = state.color ?? 'primary'

        return {
          color: colorSchemes[color].tonal.base.foreground,
        }
      }),
      title: createStyleResolver<ChatMessageCardState, TextStyle>((state) => {
        const color = state.color ?? 'primary'

        return {
          color: colorSchemes[color].text.base.foreground,
          fontSize: 14,
          fontWeight: hightideTypography.fontWeight.bold,
        }
      }),
      subtitle: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 12,
      })),
      body: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        paddingHorizontal: 15,
        paddingVertical: 12,
        gap: 4,
      })),
      actions: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 15,
        paddingBottom: 15,
      })),
    },
    attachmentCard: {
      container: createStyleResolver<ChatAttachmentCardState, ViewStyle>((state) => {
        const outgoing = state.direction === 'outgoing'
        const radius = 12
        const corner = 4

        return {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          maxWidth: 280,
          padding: 12,
          backgroundColor: semantic.surface,
          borderWidth: 1,
          borderColor: semantic.divider,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: outgoing ? radius : corner,
          borderBottomRightRadius: outgoing ? corner : radius,
          alignSelf: outgoing ? 'flex-end' : 'flex-start',
        }
      }),
      icon: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        width: 44,
        height: 44,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HexColorUtils.hexWithAlpha(colorSchemes.negative.filled.base.background, 0.2),
      })),
      iconColor: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: colorSchemes.negative.text.base.foreground,
      })),
      name: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.onSurface,
        fontSize: 14,
        fontWeight: hightideTypography.fontWeight.medium,
      })),
      metadata: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 12,
      })),
    },
    systemLine: {
      container: createStyleResolver<ChatSystemLineState, ViewStyle>(() => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        gap: 6,
      })),
      text: createStyleResolver<ChatSystemLineState, TextStyle>((state) => {
        const color = state.color ?? 'primary'

        return {
          color: colorSchemes[color].text.base.foreground,
          fontSize: 12,
          fontWeight: hightideTypography.fontWeight.medium,
        }
      }),
      icon: createValueResolver<ChatSystemLineState, { color: Color }>((state) => {
        const color = state.color ?? 'primary'

        return {
          color: colorSchemes[color].text.base.foreground,
        }
      }),
    },
    dateDivider: {
      container: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        alignSelf: 'center',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: semantic.surface,
      })),
      text: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 12,
        fontWeight: hightideTypography.fontWeight.medium,
      })),
    },
    quickReplyChip: {
      container: createStyleResolver<ChatQuickReplyChipState, ViewStyle>((state) => {
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
          borderColor: state.isActive ? colorSchemes.primary.filled.base.background : semantic.divider,
          backgroundColor: pressed ? semantic.surfaceHover : semantic.surface,
        }
      }),
      text: createStyleResolver<ChatQuickReplyChipState, TextStyle>((state) => ({
        color: state.isActive ? colorSchemes.primary.text.base.foreground : semantic.description,
        fontSize: 14,
        fontWeight: hightideTypography.fontWeight.medium,
      })),
    },
    messageComposer: {
      container: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: semantic.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: semantic.divider,
      })),
      input: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        flex: 1,
        minHeight: 44,
        maxHeight: 44 * 7,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: semantic.surfaceVariant,
        color: semantic.onSurface,
        fontSize: 15,
      })),
      placeholderColor: createValueResolver<Record<string, never>, Color>(() => semantic.placeholder),
    },
  }
}

export const createChatThemeFromDesign = (theme: DesignTokensTheme): ChatTheme => {
  return createChatTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes as ColorSchemes,
  })
}
