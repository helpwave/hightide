import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { TextareaContext, type TextareaContextValue } from './TextareaContext'
import { textareaStateTransition, type TextareaEvent, type TextareaState } from './TextareaState'

export type TextareaStateManagerProps = InputStateMangerProps<TextareaState, TextareaEvent>
  & {
    children?: ReactNode,
  }

export function TextareaStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: TextareaStateManagerProps) {
  const machine = useStateMachine<TextareaState, TextareaEvent>({
    state,
    transition: textareaStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: TextareaEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])

  const contextValue = useMemo<TextareaContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <TextareaContext.Provider value={contextValue}>
      {children}
    </TextareaContext.Provider>
  )
}
