import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatConversationRowPreviewProps = HTMLAttributes<HTMLSpanElement>

export const ChatConversationRowPreview = forwardRef<HTMLSpanElement, ChatConversationRowPreviewProps>(
  function ChatConversationRowPreview({ children, className, ...props }, forwardedRef) {
    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row-preview', className)}
      >
        {children}
      </span>
    )
  }
)
