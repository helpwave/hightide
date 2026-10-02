import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Download, FileText } from 'lucide-react'
import { ColoringUtils } from '../../../utils/coloring'
import { Icon } from '../../visualization/Icon'
import { ChatMessageBubble, type ChatMessageBubbleProps } from './ChatMessageBubble'

export type ChatAttachmentMessageBubbleProps = Omit<ChatMessageBubbleProps, 'children'> & {
  children?: ReactNode,
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  downloadLabel?: string,
  onDownload?: () => void,
}

export const ChatAttachmentMessageBubble = ({
  children,
  name,
  metadata,
  icon,
  downloadLabel = 'Download',
  onDownload,
  direction,
  className,
  ...bubbleProps
}: ChatAttachmentMessageBubbleProps) => {
  const content = (
    <>
      <span className="chat-attachment-message-file-icon" {...ColoringUtils.build({ color: 'secondary', colorVariant: 'tonal' })}>
        {icon ?? <Icon icon={FileText} size="md" />}
      </span>
      <span className="chat-attachment-message-info">
        {typeof name === 'string' || typeof name === 'number' ? (
          <span className="chat-attachment-message-name">{name}</span>
        ) : (
          name
        )}
        {metadata != null && (
          typeof metadata === 'string' || typeof metadata === 'number' ? (
            <span className="chat-attachment-message-metadata">{metadata}</span>
          ) : (
            metadata
          )
        )}
      </span>
      <Icon icon={Download} size="sm" className="chat-attachment-message-download-icon" />
    </>
  )

  return (
    <ChatMessageBubble
      {...bubbleProps}
      direction={direction}
      className={clsx('chat-attachment-message-bubble', className)}
    >
      {children}
      {onDownload ? (
        <button
          type="button"
          className="chat-attachment-message-content"
          aria-label={downloadLabel}
          onClick={onDownload}
          {...ColoringUtils.build({
            color: direction === 'outgoing' ? 'primary-inverse' : 'surface-inverse',
            mode: 'interactive',
            coloringStyle: 'foreground'
          })}
        >
          {content}
        </button>
      ) : (
        <div
          className="chat-attachment-message-content"
          {...ColoringUtils.build({
            color: direction === 'outgoing' ? 'primary' : 'neutral',
            mode: 'static',
            colorVariant: 'tonal',
          })}
        >
          {content}
        </div>
      )}
    </ChatMessageBubble>
  )
}
