import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import type { AvatarWithStatusProps } from '../display-and-visualization/Avatar'
import { AvatarWithStatus } from '../display-and-visualization/Avatar'
import { PropsUtil } from '@/src/utils/propsUtil'

export type ChatConversationRowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  avatar: AvatarWithStatusProps,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  isUnread?: boolean,
  hasSentIndicator?: boolean,
}

export const ChatConversationRow = ({
  avatar,
  title,
  timestamp,
  preview,
  unreadCount,
  isSelected = false,
  isUnread = false,
  hasSentIndicator = false,
  ...props
}: ChatConversationRowProps) => {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      data-name="chat-conversation-row"
      data-selected={PropsUtil.dataAttributes.bool(isSelected)}
      data-unread={PropsUtil.dataAttributes.bool(isUnread)}
    >
      <AvatarWithStatus size="md" {...avatar}/>
      <span data-name="chat-conversation-row-content">
        <span data-name="chat-conversation-row-top">
          <span data-name="chat-conversation-row-title">{title}</span>
          {timestamp && (
            <span data-name="chat-conversation-row-timestamp">{timestamp}</span>
          )}
        </span>
        <span data-name="chat-conversation-row-bottom">
          <span data-name="chat-conversation-row-preview">
            {hasSentIndicator && (
              <Check data-name="chat-conversation-row-sent-indicator"/>
            )}
            {preview}
          </span>
          {!!unreadCount && (
            <span data-name="chat-conversation-row-unread-count">{unreadCount}</span>
          )}
        </span>
      </span>
    </button>
  )
}
