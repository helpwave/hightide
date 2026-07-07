import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { SquarePen } from 'lucide-react'
import { IconButton } from '../user-interaction/IconButton'
import { SearchBar } from '../user-interaction/input/SearchBar'

export type ChatConversationListProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode,
  onCreate?: () => void,
  createLabel?: string,
  hasSearch?: boolean,
  searchPlaceholder?: string,
  onSearch?: (value: string) => void,
  header?: ReactNode,
  footer?: ReactNode,
}

export const ChatConversationList = ({
  title,
  onCreate,
  createLabel = 'New chat',
  hasSearch = false,
  searchPlaceholder,
  onSearch,
  header,
  footer,
  children,
  ...props
}: ChatConversationListProps) => {
  const hasHeader = !!title || !!onCreate || hasSearch || !!header
  return (
    <div {...props} className={clsx('chat-conversation-list', props.className)}>
      {hasHeader && (
        <div className="chat-conversation-list-header">
          {(title || onCreate) && (
            <div className="chat-conversation-list-header-top">
              {title && (
                <span className="chat-conversation-list-title">{title}</span>
              )}
              {onCreate && (
                <IconButton
                  tooltip={createLabel}
                  size="sm"
                  color="neutral"
                  coloringStyle="text"
                  onClick={onCreate}
                >
                  <SquarePen/>
                </IconButton>
              )}
            </div>
          )}
          {hasSearch && (
            <SearchBar
              placeholder={searchPlaceholder}
              onValueChange={onSearch}
              onSearch={onSearch ?? (() => {})}
            />
          )}
          {header}
        </div>
      )}
      <div className="chat-conversation-list-scroll">
        {children}
      </div>
      {footer && (
        <div className="chat-conversation-list-footer">{footer}</div>
      )}
    </div>
  )
}
