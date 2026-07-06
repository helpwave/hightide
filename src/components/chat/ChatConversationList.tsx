import type { HTMLAttributes, ReactNode } from 'react'

export type ChatConversationListProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode,
  footer?: ReactNode,
}

export const ChatConversationList = ({
  header,
  footer,
  children,
  ...props
}: ChatConversationListProps) => {
  return (
    <div {...props} data-name="chat-conversation-list">
      {header && (
        <div data-name="chat-conversation-list-header">{header}</div>
      )}
      <div data-name="chat-conversation-list-scroll">
        {children}
      </div>
      {footer && (
        <div data-name="chat-conversation-list-footer">{footer}</div>
      )}
    </div>
  )
}
