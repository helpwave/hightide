import type { HTMLAttributes, ReactNode } from 'react'
import { PropsUtil } from '@/src/utils/propsUtil'

export type ChatLayoutProps = HTMLAttributes<HTMLDivElement> & {
  conversationList: ReactNode,
  isConversationOpen?: boolean,
}

export const ChatLayout = ({
  conversationList,
  isConversationOpen = false,
  children,
  ...props
}: ChatLayoutProps) => {
  return (
    <div
      {...props}
      data-name="chat-layout"
      data-conversation-open={PropsUtil.dataAttributes.bool(isConversationOpen)}
    >
      <div data-name="chat-layout-sidebar">
        {conversationList}
      </div>
      <div data-name="chat-layout-thread">
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
    <div {...props} data-name="chat-thread">
      {header}
      {children}
      {footer}
    </div>
  )
}
