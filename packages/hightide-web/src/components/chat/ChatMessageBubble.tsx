import { useMemo, type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import { Check, CheckCheck, Clock } from 'lucide-react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat, useLocalization } from '../../global-contexts/localization/forward-exports'
import { Icon } from '../display-and-visualization/Icon'

export const chatMessageDirections = ['incoming', 'outgoing'] as const

export type ChatMessageDirection = typeof chatMessageDirections[number]

export const chatMessageStatuses = ['sent', 'sending', 'received', 'read'] as const

export type ChatMessageStatus = typeof chatMessageStatuses[number]

export type ChatMessageBubbleProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  direction: ChatMessageDirection,
  timestamp?: Date,
  status?: ChatMessageStatus,
  children?: ReactNode,
}

const statusIcon = (status: ChatMessageStatus) => (
  status === 'sending'
    ? Clock
    : status === 'sent'
      ? Check
      : CheckCheck
)

export const ChatMessageBubble = ({
  direction,
  timestamp,
  status,
  children,
  className,
  ...props
}: ChatMessageBubbleProps) => {
  const { locale } = useLocalization()
  const { is24HourFormat, timeZone } = useDateTimeFormat()
  const formattedTimestamp = useMemo(() => (
    timestamp === undefined
      ? undefined
      : DateUtils.formatAbsolute(timestamp, locale, 'time', { timeZone, is24HourFormat })
  ), [timestamp, locale, timeZone, is24HourFormat])
  const hasMetaData = formattedTimestamp != null || status != null

  return (
    <div
      {...props}
      className={clsx('chat-message-bubble-container', className)}
      data-direction={direction}
    >
      <div className="chat-message-bubble-body">
        {typeof children === 'string' || typeof children === 'number' ? (
          <span className="chat-message-bubble-body-text">{children}</span>
        ) : (
          children
        )}
      </div>
      {hasMetaData && (
        <span className="chat-message-bubble-metadata">
          {status != null && (
            <span className="chat-message-bubble-metadata-status">
              <Icon
                icon={statusIcon(status)}
                size="xs"
                className="chat-message-bubble-metadata-icon"
                data-status={status}
              />
            </span>
          )}
          {formattedTimestamp != null && (
            <span className="chat-message-bubble-metadata-text">{formattedTimestamp}</span>
          )}
        </span>
      )}
    </div>
  )
}
