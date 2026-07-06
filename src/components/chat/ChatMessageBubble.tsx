import type { HTMLAttributes, ReactNode } from 'react'
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
      data-name="chat-message-bubble-container"
      data-direction={direction}
    >
      <div data-name="chat-message-bubble" data-direction={direction}>
        <span data-name="chat-message-bubble-content">{children}</span>
        {timestamp && (
          <span data-name="chat-message-bubble-timestamp">{timestamp}</span>
        )}
      </div>
      {readReceipt && (
        <span data-name="chat-message-bubble-receipt">
          <CheckCheck data-name="chat-message-bubble-receipt-icon"/>
          {readReceipt}
        </span>
      )}
    </div>
  )
}
