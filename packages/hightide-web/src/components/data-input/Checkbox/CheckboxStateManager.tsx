import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStableEvent, useStateMachine, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { CheckboxContext, type CheckboxContextValue } from './CheckboxContext'
import { checkboxStateTransition, type CheckboxEvent, type CheckboxState } from './CheckboxState'

export type CheckboxStateManagerProps = ControllableStateInputProps<CheckboxState, CheckboxEvent>
  & {
    children?: ReactNode,
  }

export function CheckboxStateManager({
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
}: CheckboxStateManagerProps) {
  const [state, setState] = useControlledState({
    defaultValue: { ...initialState, value: controlledValue ?? initialState?.value ?? false },
    value: controlledState,
    onValueChange: onStateChange,
  })

  const valueBinding = useStateMachineBinding<CheckboxState, boolean>({
    state,
    onStateChange: setState,
    onValueChange,
    value: controlledValue,
    inject: useCallback((next) => ({ value: next }), []),
    get: useCallback((current) => current.value, []),
  })

  const machine = useStateMachine<CheckboxState, CheckboxEvent>({
    state: valueBinding.state,
    transition: checkboxStateTransition,
    onStateChange: valueBinding.onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: CheckboxEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])

  const contextValue = useMemo<CheckboxContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <CheckboxContext.Provider value={contextValue}>
      {children}
    </CheckboxContext.Provider>
  )
}
