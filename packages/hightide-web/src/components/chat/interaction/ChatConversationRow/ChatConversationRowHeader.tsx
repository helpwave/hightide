import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatConversationRowHeaderProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowHeader = forwardRef<HTMLSpanElement, ChatConversationRowHeaderProps>(
  function ChatConversationRowHeader({ className, ...props }, forwardedRef) {
    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-top', className)}
      />
    )
  }
)
