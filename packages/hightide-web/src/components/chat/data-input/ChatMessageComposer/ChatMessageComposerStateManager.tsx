import { useCallback, useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../../data-input/domInput'
import { useInputStateManager, useStableEvent } from '@helpwave/hightide-utils/hooks'
import { ChatMessageComposerContext, type ChatMessageComposerContextValue } from './ChatMessageComposerContext'
import {
  chatMessageComposerStateTransition,
  type ChatMessageComposerEvent,
  type ChatMessageComposerState
} from './ChatMessageComposerState'

export type ChatMessageComposerStateManagerProps = DOMInputStateManagerProps<
  ChatMessageComposerState,
  ChatMessageComposerEvent
> & {
  onSend: (value: string) => void,
}

export function ChatMessageComposerStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  onSend,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: ChatMessageComposerStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: '' },
    transition: chatMessageComposerStateTransition,
    onStateChange,
    onStateEvent,
  })
  const onSendStable = useStableEvent(onSend)
  const dispatch = useCallback((event: ChatMessageComposerEvent) => {
    machine.dispatch(event)
    if (event.type === 'send') {
      onSendStable(event.value)
    }
  }, [machine, onSendStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [id, isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<ChatMessageComposerContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
    onSend: onSendStable,
  }), [config, dispatch, machine.state, onSendStable])

  return (
    <ChatMessageComposerContext.Provider value={contextValue}>
      {children}
    </ChatMessageComposerContext.Provider>
  )
}
