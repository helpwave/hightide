import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatConversationRowContentProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowContent = forwardRef<HTMLSpanElement, ChatConversationRowContentProps>(
  function ChatConversationRowContent({ className, ...props }, forwardedRef) {
    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-content', className)}
      />
    )
  }
)
