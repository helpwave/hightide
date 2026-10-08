import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { useStateMachine, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateTransition, textInputValueBinding, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = ControllableStateInputProps<TextInputState, TextInputEvent>
  & {
    children?: ReactNode,
  }

export function TextInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  value: controlledValue,
  initialValue = '',
  initialState,
  onValueChange,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: TextInputStateManagerProps) {
  const machine = useStateMachine({
    initialState: () => initialState ?? { value: initialValue },
    transition: textInputStateTransition,
    state,
    onStateEvent,
    onStateChange,
  })

  const boundValue = useStateMachineBinding({
    state: machine.state,
    dispatch: machine.dispatch,
    binding: textInputValueBinding,
    value: controlledValue,
    defaultValue: initialValue,
    onChange: onValueChange,
  })

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])

  const dispatch = useCallback((event: TextInputEvent) => {
    if (event.type === 'change') {
      boundValue.setValue(event.value)
      return
    }
    machine.dispatch(event)
  }, [boundValue.setValue, machine.dispatch])

  const contextState = boundValue.value === machine.state.value
    ? machine.state
    : { value: boundValue.value }

  const contextValue = useMemo<TextInputContextValue>(() => ({
    state: contextState,
    dispatch,
    config,
  }), [config, contextState, dispatch])

  return (
    <TextInputContext.Provider value={contextValue}>
      {children}
    </TextInputContext.Provider>
  )
}
