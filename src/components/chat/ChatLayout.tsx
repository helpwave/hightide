import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '@/src/utils/propsUtil'

export type ChatLayoutListPosition = 'left' | 'right'

export type ChatLayoutProps = HTMLAttributes<HTMLDivElement> & {
  conversationList: ReactNode,
  isConversationOpen?: boolean,
  listPosition?: ChatLayoutListPosition,
}

export const ChatLayout = ({
  conversationList,
  isConversationOpen = false,
  listPosition = 'left',
  children,
  ...props
}: ChatLayoutProps) => {
  return (
    <div
      {...props}
      className={clsx('chat-layout', props.className)}
      data-conversation-open={PropsUtil.dataAttributes.bool(isConversationOpen)}
      data-list-position={listPosition}
    >
      <div className="chat-layout-sidebar">
        {conversationList}
      </div>
      <div className="chat-layout-thread">
        {children}
      </div>
    </div>
  )
}

export type ChatThreadProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode,
  footer?: ReactNode,
}

export const ChatThread = ({
  header,
  footer,
  children,
  ...props
}: ChatThreadProps) => {
  return (
    <div {...props} className={clsx('chat-thread', props.className)}>
      {header}
      {children}
      {footer}
    </div>
  )
}
