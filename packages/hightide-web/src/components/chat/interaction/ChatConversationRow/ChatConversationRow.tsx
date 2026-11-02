import type { ComponentRef, MouseEventHandler, ReactNode, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import {
  ChatConversationRowAvatar,
  type ChatConversationRowAvatarProps
} from './ChatConversationRowAvatar'
import {
  ChatConversationRowBody,
  type ChatConversationRowBodyProps
} from './ChatConversationRowBody'
import {
  ChatConversationRowContent,
  type ChatConversationRowContentProps
} from './ChatConversationRowContent'
import {
  ChatConversationRowContext,
  type ChatConversationSentIndicator
} from './ChatConversationRowContext'
import {
  ChatConversationRowHeader,
  type ChatConversationRowHeaderProps
} from './ChatConversationRowHeader'
import {
  ChatConversationRowLayout,
  type ChatConversationRowLayoutProps
} from './ChatConversationRowLayout'
import {
  ChatConversationRowPreview,
  type ChatConversationRowPreviewProps
} from './ChatConversationRowPreview'
import {
  ChatConversationRowSentIndicator,
  type ChatConversationRowSentIndicatorProps
} from './ChatConversationRowSentIndicator'
import {
  ChatConversationRowTimestamp,
  type ChatConversationRowTimestampProps
} from './ChatConversationRowTimestamp'
import {
  ChatConversationRowTitle,
  type ChatConversationRowTitleProps
} from './ChatConversationRowTitle'
import {
  ChatConversationRowUnreadCount,
  type ChatConversationRowUnreadCountProps
} from './ChatConversationRowUnreadCount'

export type ChatConversationRowProps = {
  avatar: ChatConversationRowAvatarProps,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  sentIndicator?: ChatConversationSentIndicator,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
  layoutRef?: Ref<ComponentRef<typeof ChatConversationRowLayout>>,
  layoutProps?: ChatConversationRowLayoutProps,
  avatarRef?: Ref<ComponentRef<typeof ChatConversationRowAvatar>>,
  avatarProps?: ChatConversationRowAvatarProps,
  contentRef?: Ref<ComponentRef<typeof ChatConversationRowContent>>,
  contentProps?: ChatConversationRowContentProps,
  headerRef?: Ref<ComponentRef<typeof ChatConversationRowHeader>>,
  headerProps?: ChatConversationRowHeaderProps,
  titleRef?: Ref<ComponentRef<typeof ChatConversationRowTitle>>,
  titleProps?: ChatConversationRowTitleProps,
  timestampRef?: Ref<ComponentRef<typeof ChatConversationRowTimestamp>>,
  timestampProps?: ChatConversationRowTimestampProps,
  bodyRef?: Ref<ComponentRef<typeof ChatConversationRowBody>>,
  bodyProps?: ChatConversationRowBodyProps,
  previewRef?: Ref<ComponentRef<typeof ChatConversationRowPreview>>,
  previewProps?: ChatConversationRowPreviewProps,
  sentIndicatorRef?: Ref<ComponentRef<typeof ChatConversationRowSentIndicator>>,
  sentIndicatorProps?: ChatConversationRowSentIndicatorProps,
  unreadCountRef?: Ref<ComponentRef<typeof ChatConversationRowUnreadCount>>,
  unreadCountProps?: ChatConversationRowUnreadCountProps,
}

const ChatConversationRowComponent = ({
  avatar,
  title,
  timestamp,
  preview,
  unreadCount,
  isSelected = false,
  sentIndicator,
  onClick,
  disabled,
  layoutRef,
  layoutProps,
  avatarRef,
  avatarProps,
  contentRef,
  contentProps,
  headerRef,
  headerProps,
  titleRef,
  titleProps,
  timestampRef,
  timestampProps,
  bodyRef,
  bodyProps,
  previewRef,
  previewProps,
  sentIndicatorRef,
  sentIndicatorProps,
  unreadCountRef,
  unreadCountProps,
}: ChatConversationRowProps) => {
  const isUnread = (unreadCount ?? 0) > 0

  return (
    <ChatConversationRowContext.Provider
      value={{
        isSelected,
        unreadCount,
        isUnread,
        sentIndicator,
      }}
    >
      <ChatConversationRowLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        disabled={disabled ?? layoutProps?.disabled}
        onClick={onClick ?? layoutProps?.onClick}
        leading={(
          <ChatConversationRowAvatar
            {...avatar}
            {...avatarProps}
            ref={ReactUtils.assingRefsBuilder([avatarRef])}
          />
        )}
        content={(
          <ChatConversationRowContent
            {...contentProps}
            ref={ReactUtils.assingRefsBuilder([contentRef])}
          >
            <ChatConversationRowHeader
              {...headerProps}
              ref={ReactUtils.assingRefsBuilder([headerRef])}
            >
              <ChatConversationRowTitle
                {...titleProps}
                ref={ReactUtils.assingRefsBuilder([titleRef])}
              >
                {title}
              </ChatConversationRowTitle>
              <ChatConversationRowTimestamp
                {...timestampProps}
                ref={ReactUtils.assingRefsBuilder([timestampRef])}
              >
                {timestamp}
              </ChatConversationRowTimestamp>
            </ChatConversationRowHeader>
            <ChatConversationRowBody
              {...bodyProps}
              ref={ReactUtils.assingRefsBuilder([bodyRef])}
            >
              <ChatConversationRowPreview
                {...previewProps}
                ref={ReactUtils.assingRefsBuilder([previewRef])}
              >
                <ChatConversationRowSentIndicator
                  {...sentIndicatorProps}
                  ref={ReactUtils.assingRefsBuilder([sentIndicatorRef])}
                />
                <span className="chat-conversation-row-preview-text">
                  {preview}
                </span>
              </ChatConversationRowPreview>
              <ChatConversationRowUnreadCount
                {...unreadCountProps}
                ref={ReactUtils.assingRefsBuilder([unreadCountRef])}
              />
            </ChatConversationRowBody>
          </ChatConversationRowContent>
        )}
      />
    </ChatConversationRowContext.Provider>
  )
}

export const ChatConversationRow = Object.assign(ChatConversationRowComponent, {
  Layout: ChatConversationRowLayout,
  Avatar: ChatConversationRowAvatar,
  Content: ChatConversationRowContent,
  Header: ChatConversationRowHeader,
  Title: ChatConversationRowTitle,
  Timestamp: ChatConversationRowTimestamp,
  Body: ChatConversationRowBody,
  Preview: ChatConversationRowPreview,
  SentIndicator: ChatConversationRowSentIndicator,
  UnreadCount: ChatConversationRowUnreadCount,
  Context: ChatConversationRowContext,
  Provider: ChatConversationRowContext.Provider,
  Consumer: ChatConversationRowContext.Consumer,
})
