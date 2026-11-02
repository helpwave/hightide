import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../../data-input/domInput'
import type { ChatMessageComposerEvent, ChatMessageComposerState } from './ChatMessageComposerState'

export type ChatMessageComposerContextValue = DOMInputContextValue<
  ChatMessageComposerState,
  ChatMessageComposerEvent,
  DOMInputConfig
> & {
  onSend: (value: string) => void,
}

export const ChatMessageComposerContext = createContext<ChatMessageComposerContextValue | null>(null)

export function useChatMessageComposerContext(): ChatMessageComposerContextValue {
  const context = useContext(ChatMessageComposerContext)
  if (!context) {
    throw new Error('useChatMessageComposerContext must be used inside a ChatMessageComposer.StateManager')
  }
  return context
}
