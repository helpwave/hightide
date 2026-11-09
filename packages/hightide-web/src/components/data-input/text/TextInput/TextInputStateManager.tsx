import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateTransition, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = DOMInputStateMangerProps<TextInputState, TextInputEvent>

export function TextInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: TextInputStateManagerProps) {
  const machine = useStateMachine({
    state,
    transition: textInputStateTransition,
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

  const contextValue = useMemo<TextInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <TextInputContext.Provider value={contextValue}>
      {children}
    </TextInputContext.Provider>
  )
}
