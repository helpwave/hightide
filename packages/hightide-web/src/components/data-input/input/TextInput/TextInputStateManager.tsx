import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStableEvent, useStateMachine, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateTransition, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = ControllableStateInputProps<TextInputState, TextInputEvent>
  & {
    children?: ReactNode,
  }

export function TextInputStateManager({
  state: controlledState,
  onStateChange,
  onStateEvent,
  value: controlledValue,
  initialState,
  onValueChange,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: TextInputStateManagerProps) {
  const [state, setState] = useControlledState({
    defaultValue: { ...initialState, value: controlledValue ?? initialState?.value ?? '' },
    value: controlledState,
    onValueChange: onStateChange
  })

  const valueBinding = useStateMachineBinding<TextInputState, string>({
    state,
    onStateChange: setState,
    onValueChange,
    value: controlledValue,
    inject: useCallback((next) => ({ value: next }), []),
    get: useCallback((current) => current.value, []),
  })

  const machine = useStateMachine<TextInputState, TextInputEvent>({
    state: valueBinding.state,
    transition: textInputStateTransition,
    onStateChange: valueBinding.onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: TextInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])

  const contextValue = useMemo<TextInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <TextInputContext.Provider value={contextValue}>
      {children}
    </TextInputContext.Provider>
  )
}
