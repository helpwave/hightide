import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { Icon } from '../../../visualization/Icon'
import { useChatConversationRowContext } from './ChatConversationRowContext'

export type ChatConversationRowSentIndicatorProps = Omit<ComponentProps<typeof Icon>, 'icon'>

export const ChatConversationRowSentIndicator = forwardRef<HTMLSpanElement, ChatConversationRowSentIndicatorProps>(
  function ChatConversationRowSentIndicator({ className, ...props }, forwardedRef) {
    const { sentIndicator } = useChatConversationRowContext()
    if (!sentIndicator) {
      return null
    }

    const SentIndicatorIcon = sentIndicator === 'sentAndReceived' ? CheckCheck : Check

    return (
      <span ref={forwardedRef} className="contents">
        <Icon
          {...props}
          icon={SentIndicatorIcon}
          size="xs"
          className={clsx('chat-conversation-row-sent-indicator', className)}
          data-sent-indicator={sentIndicator}
        />
      </span>
    )
  }
)
