import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { Children, forwardRef } from 'react'

export type ChatConversationRowTimestampProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowTimestamp = forwardRef<HTMLSpanElement, ChatConversationRowTimestampProps>(
  function ChatConversationRowTimestamp({ children, className, ...props }, forwardedRef) {
    if (Children.count(children) === 0) {
      return null
    }

    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-timestamp', className)}
      >
        {children}
      </span>
    )
  }
)
