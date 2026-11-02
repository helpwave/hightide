import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useChatConversationRowContext } from './ChatConversationRowContext'

export type ChatConversationRowUnreadCountProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowUnreadCount = forwardRef<HTMLSpanElement, ChatConversationRowUnreadCountProps>(
  function ChatConversationRowUnreadCount({ children, className, ...props }, forwardedRef) {
    const { isUnread, unreadCount } = useChatConversationRowContext()
    if (!isUnread) {
      return null
    }

    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-unread-count', className)}
      >
        {children ?? unreadCount}
      </span>
    )
  }
)
