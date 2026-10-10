import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { CheckboxContext, type CheckboxContextValue } from './CheckboxContext'
import { checkboxStateTransition, type CheckboxEvent, type CheckboxState } from './CheckboxState'

export type CheckboxStateManagerProps = InputStateMangerProps<CheckboxState, CheckboxEvent>
  & {
    children?: ReactNode,
  }

export function CheckboxStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: CheckboxStateManagerProps) {
  const machine = useStateMachine<CheckboxState, CheckboxEvent>({
    state,
    transition: checkboxStateTransition,
    onStateChange,
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
