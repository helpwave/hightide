import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { TextareaContext, type TextareaContextValue } from './TextareaContext'
import { textareaStateTransition, type TextareaEvent, type TextareaState } from './TextareaState'

export type TextareaStateManagerProps = DOMInputStateMangerProps<TextareaState, TextareaEvent>

export function TextareaStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: TextareaStateManagerProps) {
  const machine = useStateMachine({
    state,
    transition: textareaStateTransition,
    onStateChange,
    onStateEvent,
  })

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])

  const contextValue = useMemo<TextareaContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <TextareaContext.Provider value={contextValue}>
      {children}
    </TextareaContext.Provider>
  )
}
