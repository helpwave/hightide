import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { NumberStepperInputContext, type NumberStepperInputContextValue } from './NumberStepperInputContext'
import {
  numberStepperInputStateTransition,
  type NumberStepperInputEvent,
  type NumberStepperInputState
} from './NumberStepperInputState'

export type NumberStepperInputStateManagerProps = DOMInputStateMangerProps<NumberStepperInputState, NumberStepperInputEvent>

export function NumberStepperInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: NumberStepperInputStateManagerProps) {
  const machine = useStateMachine({
    state,
    transition: numberStepperInputStateTransition,
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
  const contextValue = useMemo<NumberStepperInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <NumberStepperInputContext.Provider value={contextValue}>
      {children}
    </NumberStepperInputContext.Provider>
  )
}
