import {
  StyleSheet,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import { hexWithAlpha } from '@helpwave/hightide-design/utils'
import { fontWeights } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideThemeTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

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
import type { HightideComponentThemes } from '../types/components/hightide'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateChatThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
  coloring: HightideComponentThemes['coloring'],
}

export const createChatTheme = ({
  semantic,
  component,
  coloring,
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
          : 'transparent',
      borderLeftWidth: state.isSelected ? 4 : 0,
      borderLeftColor: state.isSelected ? semantic.primary : 'transparent',
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
        fontWeight: state.isUnread ? fontWeights.bold : fontWeights.medium,
      })),
      timestamp: createStyleResolver<ChatConversationRowState, TextStyle>((state) => ({
        color: state.isUnread ? semantic.primary : semantic.description,
        fontSize: 12,
        fontWeight: state.isUnread ? fontWeights.medium : fontWeights.base,
        flexShrink: 0,
      })),
      preview: createStyleResolver<ChatConversationRowState, TextStyle>((state) => ({
        flex: 1,
        color: state.isUnread ? semantic.onSurface : semantic.description,
        fontSize: 14,
        fontWeight: fontWeights.light,
      })),
      unreadBadge: createStyleResolver<Record<string, never>, ViewStyle>(() => ({
        minWidth: 20,
        height: 20,
        paddingHorizontal: 6,
        borderRadius: 999,
        backgroundColor: semantic.primary,
        alignItems: 'center',
        justifyContent: 'center',
      })),
      unreadBadgeText: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.onPrimary,
        fontSize: 11,
        fontWeight: fontWeights.bold,
      })),
      sentIndicator: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: semantic.primary,
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
        borderBottomColor: component.divider,
        backgroundColor: semantic.surface,
      })),
      title: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.onSurface,
        fontSize: 16,
        fontWeight: fontWeights.bold,
      })),
      subtitle: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.description,
        fontSize: 12,
        fontWeight: fontWeights.light,
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
          backgroundColor: outgoing ? semantic.primary : semantic.neutral,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: outgoing ? radius : corner,
          borderBottomRightRadius: outgoing ? corner : radius,
        }
      }),
      content: createStyleResolver<ChatMessageBubbleState, TextStyle>((state) => ({
        color: state.direction === 'outgoing' ? semantic.onPrimary : semantic.onNeutral,
        fontSize: 16,
        fontWeight: fontWeights.light,
        lineHeight: 22.4,
      })),
      timestamp: createStyleResolver<ChatMessageBubbleState, TextStyle>((state) => ({
        marginTop: 5,
        color: state.direction === 'outgoing'
          ? hexWithAlpha(semantic.onPrimary, 0.75)
          : semantic.description,
        fontSize: 11,
        fontWeight: fontWeights.medium,
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
        fontWeight: fontWeights.medium,
      })),
      receiptIcon: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: semantic.primary,
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
          borderColor: component.divider,
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
        borderBottomColor: component.divider,
      })),
      icon: createStyleResolver<ChatMessageCardState, ViewStyle>((state) => {
        const color = state.color ?? 'primary'
        const tokens = coloring[color]

        return {
          width: 36,
          height: 36,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hexWithAlpha(tokens.tonalBackground ?? tokens.color, 0.2),
        }
      }),
      iconColor: createValueResolver<ChatMessageCardState, { color: Color }>((state) => {
        const color = state.color ?? 'primary'
        const tokens = coloring[color]

        return {
          color: tokens.tonalText ?? tokens.color,
        }
      }),
      title: createStyleResolver<ChatMessageCardState, TextStyle>((state) => {
        const color = state.color ?? 'primary'
        const tokens = coloring[color]

        return {
          color: tokens.text ?? tokens.color,
          fontSize: 14,
          fontWeight: fontWeights.bold,
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
          borderColor: component.divider,
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
        backgroundColor: hexWithAlpha(semantic.negative, 0.2),
      })),
      iconColor: createValueResolver<Record<string, never>, { color: Color }>(() => ({
        color: semantic.negative,
      })),
      name: createStyleResolver<Record<string, never>, TextStyle>(() => ({
        color: semantic.onSurface,
        fontSize: 14,
        fontWeight: fontWeights.medium,
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
        const tokens = coloring[color]

        return {
          color: tokens.text ?? tokens.color,
          fontSize: 12,
          fontWeight: fontWeights.medium,
        }
      }),
      icon: createValueResolver<ChatSystemLineState, { color: Color }>((state) => {
        const color = state.color ?? 'primary'
        const tokens = coloring[color]

        return {
          color: tokens.text ?? tokens.color,
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
        fontWeight: fontWeights.medium,
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
          borderColor: state.isActive ? semantic.primary : component.divider,
          backgroundColor: pressed ? semantic.surfaceHover : semantic.surface,
        }
      }),
      text: createStyleResolver<ChatQuickReplyChipState, TextStyle>((state) => ({
        color: state.isActive ? semantic.primary : semantic.description,
        fontSize: 14,
        fontWeight: fontWeights.medium,
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
        borderTopColor: component.divider,
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
    semantic: theme.semanticColors,
    component: theme.componentColors,
    coloring: theme.coloring as HightideComponentThemes['coloring'],
  })
}
