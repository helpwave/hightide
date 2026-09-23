import type { TextStyle, ViewStyle } from 'react-native'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'
import type { ThemedPressableThemeResolvers } from './themedPressable'

export type ChatConversationRowState = TokenContextInput
export type ChatSystemLineState = TokenContextInput
export type ChatQuickReplyChipState = TokenContextInput
export type ChatMessageBubbleState = TokenContextInput
export type ChatAttachmentMessageBubbleState = TokenContextInput
export type PressableState = TokenContextInput
export type PressableContainerStyle = ViewStyle
export type PressableStateLayerStyle = ViewStyle
export type PressableTextStyle = TextStyle
export type PressableIconStyle = IconStyle

export type ChatConversationRowContentContainerStyle = ViewStyle
export type ChatConversationRowHeaderRowStyle = ViewStyle
export type ChatConversationRowMessageRowStyle = ViewStyle
export type ChatConversationRowTitleStyle = TextStyle
export type ChatConversationRowTimestampStyle = TextStyle
export type ChatConversationRowPreviewStyle = TextStyle
export type ChatConversationRowUnreadBadgeStyle = ViewStyle
export type ChatConversationRowUnreadBadgeTextStyle = TextStyle
export type ChatConversationRowSentIndicatorStyle = IconStyle

export type ChatConversationListStyle = ViewStyle
export type ChatConversationListHeaderStyle = ViewStyle
export type ChatConversationListFooterStyle = ViewStyle

export type ChatThreadHeaderStyle = ViewStyle
export type ChatThreadHeaderContentRowStyle = ViewStyle
export type ChatThreadHeaderTitleStyle = TextStyle
export type ChatThreadHeaderSubtitleStyle = TextStyle

export type ChatMessageListStyle = ViewStyle

export type ChatMessageBubbleContainerStyle = ViewStyle
export type ChatMessageBubbleBodyStyle = ViewStyle
export type ChatMessageBubbleBodyTextStyle = TextStyle
export type ChatMessageBubbleMetaDataContainerStyle = ViewStyle
export type ChatMessageBubbleMetaDataStatusContainerStyle = ViewStyle
export type ChatMessageBubbleMetaDataTextStyle = TextStyle
export type ChatMessageBubbleMetaDataIconStyle = IconStyle

export type ChatAttachmentMessageBubbleFileIconContainerStyle = ViewStyle
export type ChatAttachmentMessageBubbleFileIconStyle = IconStyle
export type ChatAttachmentMessageBubbleDownloadIconContainerStyle = ViewStyle
export type ChatAttachmentMessageBubbleDownloadIconStyle = IconStyle
export type ChatAttachmentMessageBubbleFileNameTextStyle = TextStyle
export type ChatAttachmentMessageBubbleFileMetadataTextStyle = TextStyle

export type ChatSystemLineStyle = ViewStyle
export type ChatSystemLineTextStyle = TextStyle
export type ChatSystemLineIconStyle = IconStyle

export type ChatDateDividerStyle = ViewStyle
export type ChatDateDividerTextStyle = TextStyle

export type ChatMessageComposerStyle = ViewStyle
export type ChatMessageComposerInputStyle = ViewStyle & TextStyle

export type ChatConversationRowThemeResolvers = {
  pressableOverrides?: Partial<ThemedPressableThemeResolvers>,
  contentContainer: StyleLeaf<ChatConversationRowContentContainerStyle>,
  headerRow: StyleLeaf<ChatConversationRowHeaderRowStyle>,
  messageRow: StyleLeaf<ChatConversationRowMessageRowStyle>,
  title: StyleLeaf<ChatConversationRowTitleStyle>,
  timestamp: StyleLeaf<ChatConversationRowTimestampStyle>,
  preview: StyleLeaf<ChatConversationRowPreviewStyle>,
  unreadBadge: StyleLeaf<ChatConversationRowUnreadBadgeStyle>,
  unreadBadgeText: StyleLeaf<ChatConversationRowUnreadBadgeTextStyle>,
  sentIndicator: StyleLeaf<ChatConversationRowSentIndicatorStyle>,
}

export type ChatConversationListThemeResolvers = {
  container: StyleLeaf<ChatConversationListStyle>,
  header: StyleLeaf<ChatConversationListHeaderStyle>,
  footer: StyleLeaf<ChatConversationListFooterStyle>,
}

export type ChatThreadHeaderThemeResolvers = {
  container: StyleLeaf<ChatThreadHeaderStyle>,
  contentRow: StyleLeaf<ChatThreadHeaderContentRowStyle>,
  title: StyleLeaf<ChatThreadHeaderTitleStyle>,
  subtitle: StyleLeaf<ChatThreadHeaderSubtitleStyle>,
}

export type ChatMessageListThemeResolvers = {
  container: StyleLeaf<ChatMessageListStyle>,
}

export type ChatMessageBubbleThemeResolvers = {
  container: StyleLeaf<ChatMessageBubbleContainerStyle>,
  body: StyleLeaf<ChatMessageBubbleBodyStyle>,
  bodyText: StyleLeaf<ChatMessageBubbleBodyTextStyle>,
  metaDataContainer: StyleLeaf<ChatMessageBubbleMetaDataContainerStyle>,
  metaDataStatusContainer: StyleLeaf<ChatMessageBubbleMetaDataStatusContainerStyle>,
  metaDataText: StyleLeaf<ChatMessageBubbleMetaDataTextStyle>,
  metaDataIcon: StyleLeaf<ChatMessageBubbleMetaDataIconStyle>,
}

export type ChatAttachmentMessageBubbleThemeResolvers = {
  fileIconContainer: StyleLeaf<ChatAttachmentMessageBubbleFileIconContainerStyle>,
  fileIcon: StyleLeaf<ChatAttachmentMessageBubbleFileIconStyle>,
  downloadIconContainer: StyleLeaf<ChatAttachmentMessageBubbleDownloadIconContainerStyle>,
  downloadIcon: StyleLeaf<ChatAttachmentMessageBubbleDownloadIconStyle>,
  fileNameText: StyleLeaf<ChatAttachmentMessageBubbleFileNameTextStyle>,
  fileMetadataText: StyleLeaf<ChatAttachmentMessageBubbleFileMetadataTextStyle>,
}

export type ChatSystemLineThemeResolvers = {
  container: StyleLeaf<ChatSystemLineStyle>,
  text: StyleLeaf<ChatSystemLineTextStyle>,
  icon: StyleLeaf<ChatSystemLineIconStyle>,
}

export type ChatDateDividerThemeResolvers = {
  container: StyleLeaf<ChatDateDividerStyle>,
  text: StyleLeaf<ChatDateDividerTextStyle>,
}

export type ChatQuickReplyChipThemeResolvers = {
  container?: StyleLeaf<ViewStyle>,
  text?: StyleLeaf<TextStyle>,
}

export type ChatMessageComposerThemeResolvers = {
  container: StyleLeaf<ChatMessageComposerStyle>,
  input: StyleLeaf<ChatMessageComposerInputStyle>,
  text?: StyleLeaf<TextStyle>,
  placeholder?: StyleLeaf<TextStyle>,
}

export type ChatThemeResolvers = {
  conversationRow: ChatConversationRowThemeResolvers,
  conversationList: ChatConversationListThemeResolvers,
  threadHeader: ChatThreadHeaderThemeResolvers,
  messageList: ChatMessageListThemeResolvers,
  messageBubble: ChatMessageBubbleThemeResolvers,
  attachmentMessageBubble: ChatAttachmentMessageBubbleThemeResolvers,
  systemLine: ChatSystemLineThemeResolvers,
  dateDivider: ChatDateDividerThemeResolvers,
  quickReplyChip: ChatQuickReplyChipThemeResolvers,
  messageComposer: ChatMessageComposerThemeResolvers,
}
