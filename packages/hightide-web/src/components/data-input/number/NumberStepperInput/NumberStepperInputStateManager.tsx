import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { NumberStepperInputContext, type NumberStepperInputContextValue } from './NumberStepperInputContext'
import {
  numberStepperInputStateTransition,
  type NumberStepperInputEvent,
  type NumberStepperInputState
} from './NumberStepperInputState'

export type NumberStepperInputStateManagerProps = InputStateMangerProps<NumberStepperInputState, NumberStepperInputEvent> & {
  children?: ReactNode,
}

export function NumberStepperInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: NumberStepperInputStateManagerProps) {
  const machine = useStateMachine<NumberStepperInputState, NumberStepperInputEvent>({
    state,
    transition: numberStepperInputStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: NumberStepperInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<NumberStepperInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <NumberStepperInputContext.Provider value={contextValue}>
      {children}
    </NumberStepperInputContext.Provider>
  )
}
