import { StyleSheet } from 'react-native'
import {
  fontWeights,
  hexWithAlpha,
  remToPx,
  type ColoringDefintionTokens,
  type ComponentColors,
  type DesignTokens as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type {
  ChatAttachmentCardState,
  ChatConversationRowState,
  ChatMessageBubbleState,
  ChatMessageCardState,
  ChatQuickReplyChipState,
  ChatSystemLineState,
  ChatTheme
} from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateChatThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
  coloring: ColoringDefintionTokens,
}

export const createChatTheme = ({
  semantic,
  component,
  coloring,
}: CreateChatThemeOptions): ChatTheme => {
  const resolveConversationRow = (state: ChatConversationRowState) => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: remToPx('0.75rem'),
      width: '100%' as const,
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.75rem'),
      backgroundColor: state.isSelected
        ? semantic.background
        : pressed
          ? semantic.surfaceHover
          : ('transparent' as const),
      borderLeftWidth: state.isSelected ? remToPx('0.25rem') : 0,
      borderLeftColor: state.isSelected ? semantic.primary : ('transparent' as const),
      borderRadius: remToPx('0.375rem'),
    }
  }

  return {
    conversationRow: createStyleResolver(resolveConversationRow),
    conversationRowTitle: createStyleResolver((state) => ({
      flex: 1,
      color: semantic.onSurface,
      fontSize: remToPx('1rem'),
      fontWeight: state.isUnread ? fontWeights.bold : fontWeights.medium,
    })),
    conversationRowTimestamp: createStyleResolver((state) => ({
      color: state.isUnread ? semantic.primary : semantic.description,
      fontSize: remToPx('0.75rem'),
      fontWeight: state.isUnread ? fontWeights.medium : fontWeights.base,
      flexShrink: 0,
    })),
    conversationRowPreview: createStyleResolver((state) => ({
      flex: 1,
      color: state.isUnread ? semantic.onSurface : semantic.description,
      fontSize: remToPx('0.875rem'),
      fontWeight: fontWeights.light,
    })),
    conversationRowUnreadBadge: createStyleResolver(() => ({
      minWidth: remToPx('1.25rem'),
      height: remToPx('1.25rem'),
      paddingHorizontal: remToPx('0.375rem'),
      borderRadius: 999,
      backgroundColor: semantic.primary,
      alignItems: 'center',
      justifyContent: 'center',
    })),
    conversationRowUnreadBadgeText: createStyleResolver(() => ({
      color: semantic.onPrimary,
      fontSize: remToPx('0.6875rem'),
      fontWeight: fontWeights.bold,
    })),
    conversationRowSentIndicator: createValueResolver(() => ({
      color: semantic.primary,
    })),
    conversationList: createStyleResolver(() => ({
      flex: 1,
      backgroundColor: semantic.surface,
    })),
    conversationListHeader: createStyleResolver(() => ({
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.875rem'),
      gap: remToPx('0.75rem'),
    })),
    conversationListFooter: createStyleResolver(() => ({
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.5rem'),
    })),
    threadHeader: createStyleResolver(() => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: remToPx('0.75rem'),
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.75rem'),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
      backgroundColor: semantic.surface,
    })),
    threadHeaderTitle: createStyleResolver(() => ({
      color: semantic.onSurface,
      fontSize: remToPx('1rem'),
      fontWeight: fontWeights.bold,
    })),
    threadHeaderSubtitle: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
      fontWeight: fontWeights.light,
    })),
    messageList: createStyleResolver(() => ({
      flex: 1,
      paddingHorizontal: remToPx('1rem'),
      paddingVertical: remToPx('1.125rem'),
      gap: remToPx('0.75rem'),
      backgroundColor: semantic.background,
    })),
    messageBubbleContainer: createStyleResolver((state: ChatMessageBubbleState) => ({
      maxWidth: remToPx('17.5rem'),
      gap: remToPx('0.25rem'),
      alignSelf: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
      alignItems: state.direction === 'outgoing' ? 'flex-end' : 'flex-start',
    })),
    messageBubble: createStyleResolver((state: ChatMessageBubbleState) => {
      const outgoing = state.direction === 'outgoing'
      const radius = remToPx('0.75rem')
      const corner = remToPx('0.25rem')

      return {
        paddingHorizontal: remToPx('0.9375rem'),
        paddingVertical: remToPx('0.6875rem'),
        backgroundColor: outgoing ? semantic.primary : semantic.neutral,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: outgoing ? radius : corner,
        borderBottomRightRadius: outgoing ? corner : radius,
      }
    }),
    messageBubbleContent: createStyleResolver((state: ChatMessageBubbleState) => ({
      color: state.direction === 'outgoing' ? semantic.onPrimary : semantic.onNeutral,
      fontSize: remToPx('1rem'),
      fontWeight: fontWeights.light,
      lineHeight: remToPx('1.4rem'),
    })),
    messageBubbleTimestamp: createStyleResolver((state: ChatMessageBubbleState) => ({
      marginTop: remToPx('0.3125rem'),
      color: state.direction === 'outgoing'
        ? hexWithAlpha(semantic.onPrimary, 0.75)
        : semantic.description,
      fontSize: remToPx('0.6875rem'),
      fontWeight: fontWeights.medium,
      textAlign: 'right',
    })),
    messageBubbleReceipt: createStyleResolver(() => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: remToPx('0.3125rem'),
    })),
    messageBubbleReceiptText: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.6875rem'),
      fontWeight: fontWeights.medium,
    })),
    messageBubbleReceiptIcon: createValueResolver(() => ({
      color: semantic.primary,
    })),
    messageCard: createStyleResolver((state: ChatMessageCardState) => {
      const outgoing = state.direction === 'outgoing'
      const radius = remToPx('0.75rem')
      const corner = remToPx('0.25rem')

      return {
        width: remToPx('18.125rem'),
        maxWidth: remToPx('18.75rem'),
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
    messageCardHeader: createStyleResolver(() => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: remToPx('0.625rem'),
      paddingHorizontal: remToPx('0.9375rem'),
      paddingVertical: remToPx('0.75rem'),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
    })),
    messageCardIcon: createStyleResolver((state: ChatMessageCardState) => {
      const color = state.color ?? 'primary'
      const tokens = coloring[color]

      return {
        width: remToPx('2.25rem'),
        height: remToPx('2.25rem'),
        borderRadius: remToPx('0.375rem'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hexWithAlpha(tokens.tonalBackground ?? tokens.color, 0.2),
      }
    }),
    messageCardIconColor: createValueResolver((state: ChatMessageCardState) => {
      const color = state.color ?? 'primary'
      const tokens = coloring[color]

      return {
        color: tokens.tonalText ?? tokens.color,
      }
    }),
    messageCardTitle: createStyleResolver((state: ChatMessageCardState) => {
      const color = state.color ?? 'primary'
      const tokens = coloring[color]

      return {
        color: tokens.text ?? tokens.color,
        fontSize: remToPx('0.875rem'),
        fontWeight: fontWeights.bold,
      }
    }),
    messageCardSubtitle: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
    })),
    messageCardBody: createStyleResolver(() => ({
      paddingHorizontal: remToPx('0.9375rem'),
      paddingVertical: remToPx('0.75rem'),
      gap: remToPx('0.25rem'),
    })),
    messageCardActions: createStyleResolver(() => ({
      flexDirection: 'row',
      gap: remToPx('0.625rem'),
      paddingHorizontal: remToPx('0.9375rem'),
      paddingBottom: remToPx('0.9375rem'),
    })),
    attachmentCard: createStyleResolver((state: ChatAttachmentCardState) => {
      const outgoing = state.direction === 'outgoing'
      const radius = remToPx('0.75rem')
      const corner = remToPx('0.25rem')

      return {
        flexDirection: 'row',
        alignItems: 'center',
        gap: remToPx('0.75rem'),
        maxWidth: remToPx('17.5rem'),
        padding: remToPx('0.75rem'),
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
    attachmentCardIcon: createStyleResolver(() => ({
      width: remToPx('2.75rem'),
      height: remToPx('2.75rem'),
      borderRadius: remToPx('0.375rem'),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexWithAlpha(semantic.negative, 0.2),
    })),
    attachmentCardIconColor: createValueResolver(() => ({
      color: semantic.negative,
    })),
    attachmentCardName: createStyleResolver(() => ({
      color: semantic.onSurface,
      fontSize: remToPx('0.875rem'),
      fontWeight: fontWeights.medium,
    })),
    attachmentCardMetadata: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
    })),
    systemLine: createStyleResolver(() => ({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: remToPx('0.375rem'),
    })),
    systemLineText: createStyleResolver((state: ChatSystemLineState) => {
      const color = state.color ?? 'primary'
      const tokens = coloring[color]

      return {
        color: tokens.text ?? tokens.color,
        fontSize: remToPx('0.75rem'),
        fontWeight: fontWeights.medium,
      }
    }),
    systemLineIcon: createValueResolver((state: ChatSystemLineState) => {
      const color = state.color ?? 'primary'
      const tokens = coloring[color]

      return {
        color: tokens.text ?? tokens.color,
      }
    }),
    dateDivider: createStyleResolver(() => ({
      alignSelf: 'center',
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.25rem'),
      borderRadius: 999,
      backgroundColor: semantic.surface,
    })),
    dateDividerText: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
      fontWeight: fontWeights.medium,
    })),
    quickReplyChip: createStyleResolver((state: ChatQuickReplyChipState) => {
      const pressed = !!state.isPressed && !state.isDisabled

      return {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: remToPx('0.375rem'),
        paddingHorizontal: remToPx('0.875rem'),
        paddingVertical: remToPx('0.375rem'),
        borderRadius: 999,
        borderWidth: 1,
        borderColor: state.isActive ? semantic.primary : component.divider,
        backgroundColor: pressed ? semantic.surfaceHover : semantic.surface,
      }
    }),
    quickReplyChipText: createStyleResolver((state: ChatQuickReplyChipState) => ({
      color: state.isActive ? semantic.primary : semantic.description,
      fontSize: remToPx('0.875rem'),
      fontWeight: fontWeights.medium,
    })),
    messageComposer: createStyleResolver(() => ({
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      gap: remToPx('0.5rem'),
      paddingHorizontal: remToPx('0.875rem'),
      paddingVertical: remToPx('0.75rem'),
      backgroundColor: semantic.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: component.divider,
    })),
    messageComposerInput: createStyleResolver(() => ({
      flex: 1,
      minHeight: remToPx('2.75rem'),
      maxHeight: remToPx('2.75rem') * 7,
      paddingHorizontal: remToPx('0.75rem'),
      paddingVertical: remToPx('0.75rem'),
      borderRadius: remToPx('0.375rem'),
      backgroundColor: semantic.surfaceVariant,
      color: semantic.onSurface,
      fontSize: remToPx('0.9375rem'),
    })),
    messageComposerPlaceholderColor: createValueResolver(() => semantic.placeholder),
  }
}

export const createChatThemeFromDesign = (theme: DesignTokensTheme): ChatTheme => {
  return createChatTheme({
    semantic: theme.semantic,
    component: theme.component,
    coloring: theme.coloring,
  })
}
