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
  return (
    <div
      {...props}
      className={clsx('chat-message-bubble-container', props.className)}
      data-direction={direction}
    >
      <div className="chat-message-bubble" data-direction={direction}>
        <span className="chat-message-bubble-content">{children}</span>
        {timestamp && (
          <span className="chat-message-bubble-timestamp">{timestamp}</span>
        )}
      </div>
      {readReceipt && (
        <span className="chat-message-bubble-receipt">
          <CheckCheck className="chat-message-bubble-receipt-icon"/>
          {readReceipt}
        </span>
      )}
    </div>
  )
}
