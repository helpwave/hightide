import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  SimpleStyleResolver,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons'
import type { ThemedPressableState } from './themedPressable'
import type {
  AvatarState,
  AvatarThemeResolvers
} from './avatar'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatConversationRowState = InteractionState & {
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowStyle = ViewStyle
export type ChatConversationRowTitleStyle = TextStyle
export type ChatConversationRowTimestampStyle = TextStyle
export type ChatConversationRowPreviewStyle = TextStyle
export type ChatConversationRowUnreadBadgeStyle = ViewStyle
export type ChatConversationRowUnreadBadgeTextStyle = TextStyle

export type ChatConversationListStyle = ViewStyle
export type ChatConversationListHeaderStyle = ViewStyle
export type ChatConversationListFooterStyle = ViewStyle

export type ChatThreadHeaderStyle = ViewStyle
export type ChatThreadHeaderContentRowStyle = ViewStyle
export type ChatThreadHeaderTitleStyle = TextStyle
export type ChatThreadHeaderSubtitleStyle = TextStyle

export type ChatMessageListStyle = ViewStyle

export type ChatMessageBubbleState = {
  direction: ChatMessageDirection,
}

export type ChatMessageBubbleContainerStyle = ViewStyle
export type ChatMessageBubbleBodyStyle = ViewStyle
export type ChatMessageBubbleBodyTextStyle = TextStyle
export type ChatMessageBubbleMetaDataContainerStyle = ViewStyle
export type ChatMessageBubbleMetaDataStatusContainerStyle = ViewStyle
export type ChatMessageBubbleMetaDataTextStyle = TextStyle
export type ChatMessageBubbleMetaDataIconStyle = IconStyle

export type ChatAttachmentMessageBubbleState = {
  direction: ChatMessageDirection,
}

export type PressableContainerStyle = ViewStyle
export type PressableStateLayerStyle = ViewStyle
export type PressableTextStyle = TextStyle
export type PressableIconStyle = IconStyle

export type PressableState = ThemedPressableState

export type ChatAttachmentMessageBubbleFileIconContainerStyle = ViewStyle
export type ChatAttachmentMessageBubbleFileIconStyle = IconStyle
export type ChatAttachmentMessageBubbleDownloadIconContainerStyle = ViewStyle
export type ChatAttachmentMessageBubbleDownloadIconStyle = IconStyle
export type ChatAttachmentMessageBubbleFileNameTextStyle = TextStyle
export type ChatAttachmentMessageBubbleFileMetadataTextStyle = TextStyle

export type ChatSystemLineState = {
  color?: ColorPairToken,
}

export type ChatSystemLineStyle = ViewStyle
export type ChatSystemLineTextStyle = TextStyle

export type ChatSystemLineIconStyle = IconStyle

export type ChatDateDividerStyle = ViewStyle
export type ChatDateDividerTextStyle = TextStyle

export type ChatQuickReplyChipState = {
  isActive?: boolean,
}

export type ChatMessageComposerStyle = ViewStyle
export type ChatMessageComposerInputStyle = ViewStyle & TextStyle

export type ChatConversationRowThemeResolvers = {
  container: StyleResolverFunction<ChatConversationRowState, ChatConversationRowStyle>,
  title: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTitleStyle>,
  timestamp: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  preview: StyleResolverFunction<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  unreadBadge: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeStyle>,
  unreadBadgeText: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeTextStyle>,
  sentIndicator: StyleResolverFunction<Record<string, never>, ChatMessageBubbleMetaDataIconStyle>,
}

export type ChatConversationListThemeResolvers = {
  container: StyleResolverFunction<Record<string, never>, ChatConversationListStyle>,
  header: StyleResolverFunction<Record<string, never>, ChatConversationListHeaderStyle>,
  footer: StyleResolverFunction<Record<string, never>, ChatConversationListFooterStyle>,
}

export type ChatThreadHeaderThemeResolvers = {
  container: StyleResolverFunction<Record<string, never>, ChatThreadHeaderStyle>,
  contentRow: StyleResolverFunction<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  title: StyleResolverFunction<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitle: StyleResolverFunction<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  avatar: StyleResolverFunction<
    AvatarState,
    AvatarThemeResolvers
  >,
}

export type ChatMessageListThemeResolvers = {
  container: StyleResolverFunction<Record<string, never>, ChatMessageListStyle>,
}

export type ChatMessageBubbleThemeResolvers = {
  container: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  body: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleBodyStyle>,
  bodyText: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleBodyTextStyle>,
  metaDataContainer: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleMetaDataContainerStyle>,
  metaDataStatusContainer: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleMetaDataStatusContainerStyle>,
  metaDataText: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleMetaDataTextStyle>,
  metaDataIcon: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleMetaDataIconStyle>,
}

export type ChatAttachmentMessageBubbleOverridesThemeResolvers = {
  container: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleContainerStyle>,
  body: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleBodyStyle>,
  bodyText: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleBodyTextStyle>,
  metaDataContainer: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleMetaDataContainerStyle>,
  metaDataStatusContainer: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleMetaDataStatusContainerStyle>,
  metaDataText: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleMetaDataTextStyle>,
  metaDataIcon: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatMessageBubbleMetaDataIconStyle>,
}

export type ChatAttachmentMessageBubbleThemeResolvers = {
  chatMessageBubbleOverrides: ChatAttachmentMessageBubbleOverridesThemeResolvers,
  contentContainer: StyleResolverFunction<
    ChatAttachmentMessageBubbleState,
    {
      container: StyleResolverFunction<
        PressableState,
        PressableContainerStyle
      >,
      stateLayer: StyleResolverFunction<
        PressableState,
        PressableStateLayerStyle
      >,
      text: StyleResolverFunction<
        PressableState,
        PressableTextStyle
      >,
      icon: StyleResolverFunction<
        PressableState,
        PressableIconStyle
      >,
    }
  >,
  fileIconContainer: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleFileIconContainerStyle>,
  fileIcon: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleFileIconStyle>,
  downloadIconContainer: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleDownloadIconContainerStyle>,
  downloadIcon: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleDownloadIconStyle>,
  fileNameText: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleFileNameTextStyle>,
  fileMetadataText: StyleResolverFunction<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleFileMetadataTextStyle>,
}

export type ChatSystemLineThemeResolvers = {
  container: StyleResolverFunction<ChatSystemLineState, ChatSystemLineStyle>,
  text: StyleResolverFunction<ChatSystemLineState, ChatSystemLineTextStyle>,
  icon: StyleResolverFunction<ChatSystemLineState, ChatSystemLineIconStyle>,
}

export type ChatDateDividerThemeResolvers = {
  container: StyleResolverFunction<Record<string, never>, ChatDateDividerStyle>,
  text: StyleResolverFunction<Record<string, never>, ChatDateDividerTextStyle>,
}

export type ChatQuickReplyChipThemeResolvers = {
  pressable: StyleResolverFunction<
    ChatQuickReplyChipState,
    {
      container: StyleResolverFunction<
        PressableState,
        PressableContainerStyle
      >,
      stateLayer: StyleResolverFunction<
        PressableState,
        PressableStateLayerStyle
      >,
      text: StyleResolverFunction<
        PressableState,
        PressableTextStyle
      >,
      icon: StyleResolverFunction<
        PressableState,
        PressableIconStyle
      >,
    }
  >,
}

export type ChatMessageComposerThemeResolvers = {
  container: StyleResolverFunction<Record<string, never>, ChatMessageComposerStyle>,
  input: StyleResolverFunction<Record<string, never>, ChatMessageComposerInputStyle>,
  placeholderColor: SimpleStyleResolver<TextStyle>,
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
