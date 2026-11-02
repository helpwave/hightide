import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatConversationRowBodyProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowBody = forwardRef<HTMLSpanElement, ChatConversationRowBodyProps>(
  function ChatConversationRowBody({ className, ...props }, forwardedRef) {
    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-bottom', className)}
      />
    )
  }
)
