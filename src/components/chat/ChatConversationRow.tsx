import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
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
      className={clsx('chat-conversation-row', props.className)}
      data-selected={PropsUtil.dataAttributes.bool(isSelected)}
      data-unread={PropsUtil.dataAttributes.bool(isUnread)}
    >
      <AvatarWithStatus size="md" {...avatar}/>
      <span className="chat-conversation-row-content">
        <span className="chat-conversation-row-top">
          <span className="chat-conversation-row-title">{title}</span>
          {timestamp && (
            <span className="chat-conversation-row-timestamp">{timestamp}</span>
          )}
        </span>
        <span className="chat-conversation-row-bottom">
          <span className="chat-conversation-row-preview">
            {hasSentIndicator && (
              <Check className="chat-conversation-row-sent-indicator"/>
            )}
            {preview}
          </span>
          {!!unreadCount && (
            <span className="chat-conversation-row-unread-count">{unreadCount}</span>
          )}
        </span>
      </span>
    </button>
  )
}
