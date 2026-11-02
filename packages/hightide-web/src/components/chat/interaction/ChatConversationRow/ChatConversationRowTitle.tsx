import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatConversationRowTitleProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowTitle = forwardRef<HTMLSpanElement, ChatConversationRowTitleProps>(
  function ChatConversationRowTitle({ className, ...props }, forwardedRef) {
    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-title', className)}
      />
    )
  }
)
