import clsx from 'clsx'
import { ScrollableList } from '../layout/ScrollableList'
import type { ScrollableListProps } from '../layout/ScrollableList'

export type ChatConversationListProps = Omit<ScrollableListProps, 'as'>

export const ChatConversationList = ({
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  ...props
}: ChatConversationListProps) => (
  <ScrollableList
    {...props}
    className={clsx('chat-conversation-list', className)}
    headerClassName={clsx('chat-conversation-list-header', headerClassName)}
    contentClassName={clsx('chat-conversation-list-scroll', contentClassName)}
    footerClassName={clsx('chat-conversation-list-footer', footerClassName)}
  />
)
