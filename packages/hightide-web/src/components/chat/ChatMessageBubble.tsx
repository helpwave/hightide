import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { CheckCheck } from 'lucide-react'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatMessageBubbleProps = HTMLAttributes<HTMLDivElement> & {
  direction?: ChatMessageDirection,
  timestamp?: ReactNode,
  readReceipt?: ReactNode,
}

export const ChatMessageBubble = ({
  direction = 'incoming',
  timestamp,
  readReceipt,
  children,
  ...props
}: ChatMessageBubbleProps) => {
  const hasMetaData = timestamp != null || readReceipt != null

  return (
    <div
      {...props}
      className={clsx('chat-message-bubble-container', props.className)}
      data-direction={direction}
    >
      <div className="chat-message-bubble-body">
        <span className="chat-message-bubble-body-text">{children}</span>
      </div>
      {hasMetaData && (
        <span className="chat-message-bubble-metadata">
          {readReceipt != null && (
            <span className="chat-message-bubble-metadata-status">
              <CheckCheck className="chat-message-bubble-metadata-icon"/>
              <span className="chat-message-bubble-metadata-text">{readReceipt}</span>
            </span>
          )}
          {timestamp != null && (
            <span className="chat-message-bubble-metadata-text">{timestamp}</span>
          )}
        </span>
      )}
    </div>
  )
}
