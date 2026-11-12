import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateTransition, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = DOMInputStateManagerProps<TextInputState, TextInputEvent>

export function TextInputStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: TextInputStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: '' },
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
