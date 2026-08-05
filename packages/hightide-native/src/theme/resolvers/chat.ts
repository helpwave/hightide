import { hightideChatTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type {
  ChatComponentResolverProps,
  ChatMessageDirection
} from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken, ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type {
  ChatAttachmentCardIconColor,
  ChatAttachmentCardIconStyle,
  ChatAttachmentCardMetadataStyle,
  ChatAttachmentCardNameStyle,
  ChatAttachmentCardState,
  ChatAttachmentCardStyle,
  ChatAttachmentCardTheme,
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle,
  ChatConversationListTheme,
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTheme,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  ChatConversationRowUnreadBadgeStyle,
  ChatConversationRowUnreadBadgeTextStyle,
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  ChatDateDividerTheme,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleReceiptIconStyle,
  ChatMessageBubbleReceiptStyle,
  ChatMessageBubbleReceiptTextStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTheme,
  ChatMessageBubbleTimestampStyle,
  ChatMessageCardActionsStyle,
  ChatMessageCardBodyStyle,
  ChatMessageCardHeaderStyle,
  ChatMessageCardIconColor,
  ChatMessageCardIconStyle,
  ChatMessageCardState,
  ChatMessageCardStyle,
  ChatMessageCardSubtitleStyle,
  ChatMessageCardTheme,
  ChatMessageCardTitleStyle,
  ChatMessageComposerInputStyle,
  ChatMessageComposerStyle,
  ChatMessageComposerTheme,
  ChatMessageListStyle,
  ChatMessageListTheme,
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle,
  ChatQuickReplyChipTheme,
  ChatSystemLineIconStyle,
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle,
  ChatSystemLineTheme,
  ChatTheme,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTheme,
  ChatThreadHeaderTitleStyle
} from '../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

type ChatTokenResolver = (props: ChatComponentResolverProps) => ReturnType<typeof hightideChatTokenResolver>

const emptyProps = (): ChatComponentResolverProps => ({
  config: {},
  overrides: {},
  state: {},
})

const withDirection = (direction?: ChatMessageDirection): ChatComponentResolverProps => ({
  config: { direction },
  overrides: {},
  state: {},
})

const withColor = (color?: ColorPairToken): ChatComponentResolverProps => ({
  config: {},
  overrides: { color },
  state: {},
})

const toConversationRowTokenProps = (state: ChatConversationRowState): ChatComponentResolverProps => ({
  config: {},
  overrides: {},
  state: {
    isPressed: state.isPressed,
    isDisabled: state.isDisabled,
    isUnread: state.isUnread,
    isSelected: state.isSelected,
  },
})

const toQuickReplyChipTokenProps = (state: ChatQuickReplyChipState): ChatComponentResolverProps => ({
  config: {},
  overrides: {},
  state: {
    isPressed: state.isPressed,
    isDisabled: state.isDisabled,
    isActive: state.isActive,
  },
})

const toMessageCardTokenProps = (state: ChatMessageCardState): ChatComponentResolverProps => ({
  config: {
    direction: state.direction,
  },
  overrides: {
    color: state.color,
  },
  state: {},
})

const toConversationRowTheme = (resolve: ChatTokenResolver): ChatConversationRowTheme => ({
  container: createStyleResolver((state: ChatConversationRowState): ChatConversationRowStyle => ({
    ...resolve(toConversationRowTokenProps(state)).conversationRow.container,
  })),
  title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => ({
    ...resolve(toConversationRowTokenProps(state)).conversationRow.title,
  })),
  timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => ({
    ...resolve(toConversationRowTokenProps(state)).conversationRow.timestamp,
  })),
  preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => ({
    ...resolve(toConversationRowTokenProps(state)).conversationRow.preview,
  })),
  unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => ({
    ...resolve(emptyProps()).conversationRow.unreadBadge,
  })),
  unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => ({
    ...resolve(emptyProps()).conversationRow.unreadBadgeText,
  })),
  sentIndicator: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
    color: resolve(emptyProps()).conversationRow.sentIndicator.color,
  })),
})

const toConversationListTheme = (resolve: ChatTokenResolver): ChatConversationListTheme => ({
  container: createSimpleStyleResolver((): ChatConversationListStyle => ({
    ...resolve(emptyProps()).conversationList.container,
  })),
  header: createSimpleStyleResolver((): ChatConversationListHeaderStyle => ({
    ...resolve(emptyProps()).conversationList.header,
  })),
  footer: createSimpleStyleResolver((): ChatConversationListFooterStyle => ({
    ...resolve(emptyProps()).conversationList.footer,
  })),
})

const toThreadHeaderTheme = (resolve: ChatTokenResolver): ChatThreadHeaderTheme => ({
  container: createSimpleStyleResolver((): ChatThreadHeaderStyle => ({
    ...resolve(emptyProps()).threadHeader.container,
  })),
  title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => ({
    ...resolve(emptyProps()).threadHeader.title,
  })),
  subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => ({
    ...resolve(emptyProps()).threadHeader.subtitle,
  })),
})

const toMessageListTheme = (resolve: ChatTokenResolver): ChatMessageListTheme => ({
  container: createSimpleStyleResolver((): ChatMessageListStyle => ({
    ...resolve(emptyProps()).messageList.container,
  })),
})

const toMessageBubbleTheme = (resolve: ChatTokenResolver): ChatMessageBubbleTheme => ({
  container: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContainerStyle => ({
    ...resolve(withDirection(state.direction)).messageBubble.container,
  })),
  bubble: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleStyle => ({
    ...resolve(withDirection(state.direction)).messageBubble.bubble,
  })),
  content: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContentStyle => ({
    ...resolve(withDirection(state.direction)).messageBubble.content,
  })),
  timestamp: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleTimestampStyle => ({
    ...resolve(withDirection(state.direction)).messageBubble.timestamp,
  })),
  receipt: createSimpleStyleResolver((): ChatMessageBubbleReceiptStyle => ({
    ...resolve(emptyProps()).messageBubble.receipt,
  })),
  receiptText: createSimpleStyleResolver((): ChatMessageBubbleReceiptTextStyle => ({
    ...resolve(emptyProps()).messageBubble.receiptText,
  })),
  receiptIcon: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
    color: resolve(emptyProps()).messageBubble.receiptIcon.color,
  })),
})

const toMessageCardTheme = (resolve: ChatTokenResolver): ChatMessageCardTheme => ({
  container: createStyleResolver((state: ChatMessageCardState): ChatMessageCardStyle => ({
    ...resolve(toMessageCardTokenProps(state)).messageCard.container,
  })),
  header: createSimpleStyleResolver((): ChatMessageCardHeaderStyle => ({
    ...resolve(emptyProps()).messageCard.header,
  })),
  icon: createStyleResolver((state: ChatMessageCardState): ChatMessageCardIconStyle => ({
    ...resolve(toMessageCardTokenProps(state)).messageCard.icon,
  })),
  iconColor: createValueResolver((state: ChatMessageCardState): ChatMessageCardIconColor => ({
    color: resolve(toMessageCardTokenProps(state)).messageCard.iconColor.color,
  })),
  title: createStyleResolver((state: ChatMessageCardState): ChatMessageCardTitleStyle => ({
    ...resolve(toMessageCardTokenProps(state)).messageCard.title,
  })),
  subtitle: createSimpleStyleResolver((): ChatMessageCardSubtitleStyle => ({
    ...resolve(emptyProps()).messageCard.subtitle,
  })),
  body: createSimpleStyleResolver((): ChatMessageCardBodyStyle => ({
    ...resolve(emptyProps()).messageCard.body,
  })),
  actions: createSimpleStyleResolver((): ChatMessageCardActionsStyle => ({
    ...resolve(emptyProps()).messageCard.actions,
  })),
})

const toAttachmentCardTheme = (resolve: ChatTokenResolver): ChatAttachmentCardTheme => ({
  container: createStyleResolver((state: ChatAttachmentCardState): ChatAttachmentCardStyle => ({
    ...resolve(withDirection(state.direction)).attachmentCard.container,
  })),
  icon: createSimpleStyleResolver((): ChatAttachmentCardIconStyle => ({
    ...resolve(emptyProps()).attachmentCard.icon,
  })),
  iconColor: createSimpleValueResolver((): ChatAttachmentCardIconColor => ({
    color: resolve(emptyProps()).attachmentCard.iconColor.color,
  })),
  name: createSimpleStyleResolver((): ChatAttachmentCardNameStyle => ({
    ...resolve(emptyProps()).attachmentCard.name,
  })),
  metadata: createSimpleStyleResolver((): ChatAttachmentCardMetadataStyle => ({
    ...resolve(emptyProps()).attachmentCard.metadata,
  })),
})

const toSystemLineTheme = (resolve: ChatTokenResolver): ChatSystemLineTheme => ({
  container: createStyleResolver((state: ChatSystemLineState): ChatSystemLineStyle => ({
    ...resolve(withColor(state.color)).systemLine.container,
  })),
  text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => ({
    ...resolve(withColor(state.color)).systemLine.text,
  })),
  icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => ({
    color: resolve(withColor(state.color)).systemLine.icon.color,
  })),
})

const toDateDividerTheme = (resolve: ChatTokenResolver): ChatDateDividerTheme => ({
  container: createSimpleStyleResolver((): ChatDateDividerStyle => ({
    ...resolve(emptyProps()).dateDivider.container,
  })),
  text: createSimpleStyleResolver((): ChatDateDividerTextStyle => ({
    ...resolve(emptyProps()).dateDivider.text,
  })),
})

const toQuickReplyChipTheme = (resolve: ChatTokenResolver): ChatQuickReplyChipTheme => ({
  container: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipStyle => ({
    ...resolve(toQuickReplyChipTokenProps(state)).quickReplyChip.container,
  })),
  text: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipTextStyle => ({
    ...resolve(toQuickReplyChipTokenProps(state)).quickReplyChip.text,
  })),
})

const toMessageComposerTheme = (resolve: ChatTokenResolver): ChatMessageComposerTheme => ({
  container: createSimpleStyleResolver((): ChatMessageComposerStyle => ({
    ...resolve(emptyProps()).messageComposer.container,
  })),
  input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
    ...resolve(emptyProps()).messageComposer.input,
  })),
  placeholderColor: createSimpleValueResolver((): Color => (
    resolve(emptyProps()).messageComposer.placeholderColor
  )),
})

export const toChatTheme = (themeTokens: ThemeTokens): ChatTheme => {
  const resolve: ChatTokenResolver = (props) => hightideChatTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...props,
  })

  return {
    conversationRow: toConversationRowTheme(resolve),
    conversationList: toConversationListTheme(resolve),
    threadHeader: toThreadHeaderTheme(resolve),
    messageList: toMessageListTheme(resolve),
    messageBubble: toMessageBubbleTheme(resolve),
    messageCard: toMessageCardTheme(resolve),
    attachmentCard: toAttachmentCardTheme(resolve),
    systemLine: toSystemLineTheme(resolve),
    dateDivider: toDateDividerTheme(resolve),
    quickReplyChip: toQuickReplyChipTheme(resolve),
    messageComposer: toMessageComposerTheme(resolve),
  }
}
