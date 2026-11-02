import { createContext, useContext } from 'react'

export type ChatConversationSentIndicator = 'sent' | 'sentAndReceived'

export type ChatConversationRowContextValue = {
  isSelected: boolean,
  unreadCount?: number,
  isUnread: boolean,
  sentIndicator?: ChatConversationSentIndicator,
}

export const ChatConversationRowContext = createContext<ChatConversationRowContextValue | null>(null)

export function useChatConversationRowContext(): ChatConversationRowContextValue {
  const context = useContext(ChatConversationRowContext)
  if (!context) {
    throw new Error('useChatConversationRowContext must be used inside a ChatConversationRow')
  }
  return context
}
