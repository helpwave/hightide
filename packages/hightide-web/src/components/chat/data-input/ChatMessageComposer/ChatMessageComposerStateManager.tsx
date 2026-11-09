import { useCallback, useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { ChatMessageComposerContext, type ChatMessageComposerContextValue } from './ChatMessageComposerContext'
import {
  chatMessageComposerStateTransition,
  type ChatMessageComposerEvent,
  type ChatMessageComposerState
} from './ChatMessageComposerState'

export type ChatMessageComposerStateManagerProps = DOMInputStateMangerProps<
  ChatMessageComposerState,
  ChatMessageComposerEvent
> & {
  onSend: (value: string) => void,
}

export function ChatMessageComposerStateManager({
  state,
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
  const machine = useStateMachine({
    state,
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
