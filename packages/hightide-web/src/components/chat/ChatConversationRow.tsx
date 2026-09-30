import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Check, CheckCheck } from 'lucide-react'
import { Icon } from '../display-and-visualization/Icon'
import { Avatar } from '../display-and-visualization/Avatar/Avatar'
import type { AvatarProps } from '../display-and-visualization/Avatar/AvatarComponent'
import { ColoringUtils } from '../../utils/coloring'
import { PropsUtil } from '../../utils/propsUtil'

export type ChatConversationSentIndicator = 'sent' | 'sentAndReceived'

export type ChatConversationRowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  avatar: AvatarProps,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  sentIndicator?: ChatConversationSentIndicator,
}

export const ChatConversationRow = ({
  avatar,
  title,
  timestamp,
  preview,
  unreadCount,
  isSelected = false,
  sentIndicator,
  ...props
}: ChatConversationRowProps) => {
  const isUnread = (unreadCount ?? 0) > 0
  const SentIndicatorIcon = sentIndicator === 'sentAndReceived' ? CheckCheck : Check

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('chat-conversation-row', props.className)}
      data-selected={PropsUtil.dataAttributes.bool(isSelected)}
      data-unread={PropsUtil.dataAttributes.bool(isUnread)}
    >
      <Avatar
        size="md"
        {...avatar}
        hasStatusIndicator={avatar.hasStatusIndicator ?? true}
      />
      <span className="chat-conversation-row-content">
        <span className="chat-conversation-row-top">
          <span className="chat-conversation-row-title">{title}</span>
          {timestamp && (
            <span className="chat-conversation-row-timestamp">{timestamp}</span>
          )}
        </span>
        <span className="chat-conversation-row-bottom">
          <span className="chat-conversation-row-preview">
            {sentIndicator && (
              <Icon
                icon={SentIndicatorIcon}
                size="xs"
                className="chat-conversation-row-sent-indicator"
                data-sent-indicator={sentIndicator}
              />
            )}
            <span className="chat-conversation-row-preview-text">
              {preview}
            </span>
          </span>
          {isUnread && (
            <span className="chat-conversation-row-unread-count">{unreadCount}</span>
          )}
        </span>
      </span>
    </button>
  )
}
