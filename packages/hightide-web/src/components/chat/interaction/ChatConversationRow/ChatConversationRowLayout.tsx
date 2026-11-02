import clsx from 'clsx'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import { ListActionItem, type ListActionItemProps } from '../../../layout/list/ListActionItem'
import { useChatConversationRowContext } from './ChatConversationRowContext'

export type ChatConversationRowLayoutProps = ListActionItemProps

export const ChatConversationRowLayout = forwardRef<HTMLButtonElement, ChatConversationRowLayoutProps>(
  function ChatConversationRowLayout({ className, ...props }, forwardedRef) {
    const { isSelected, isUnread } = useChatConversationRowContext()

    return (
      <ListActionItem
        {...props}
        ref={forwardedRef}
        className={clsx('chat-conversation-row', className)}
        data-selected={PropsUtil.dataAttributes.bool(isSelected)}
        data-unread={PropsUtil.dataAttributes.bool(isUnread)}
      />
    )
  }
)
