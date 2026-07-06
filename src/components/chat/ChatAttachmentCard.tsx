import type { HTMLAttributes, ReactNode } from 'react'
import { Download, FileText } from 'lucide-react'
import { IconButton } from '../user-interaction/IconButton'
import type { ChatMessageDirection } from './ChatMessageBubble'

export type ChatAttachmentCardProps = HTMLAttributes<HTMLDivElement> & {
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  direction?: ChatMessageDirection,
  downloadLabel?: string,
  onDownload?: () => void,
}

export const ChatAttachmentCard = ({
  name,
  metadata,
  icon,
  direction = 'incoming',
  downloadLabel = 'Download',
  onDownload,
  ...props
}: ChatAttachmentCardProps) => {
  return (
    <div
      {...props}
      data-name="chat-attachment-card"
      data-direction={direction}
    >
      <span data-name="chat-attachment-card-icon">
        {icon ?? <FileText/>}
      </span>
      <span data-name="chat-attachment-card-info">
        <span data-name="chat-attachment-card-filename">{name}</span>
        {metadata && (
          <span data-name="chat-attachment-card-metadata">{metadata}</span>
        )}
      </span>
      {onDownload && (
        <IconButton
          tooltip={downloadLabel}
          size="sm"
          color="primary"
          coloringStyle="text"
          onClick={onDownload}
        >
          <Download/>
        </IconButton>
      )}
    </div>
  )
}
