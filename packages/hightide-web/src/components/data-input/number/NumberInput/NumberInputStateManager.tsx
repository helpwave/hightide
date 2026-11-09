import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { NumberInputContext, type NumberInputContextValue } from './NumberInputContext'
import { numberInputStateTransition, type NumberInputEvent, type NumberInputState } from './NumberInputState'

export type NumberInputStateManagerProps = DOMInputStateMangerProps<NumberInputState, NumberInputEvent> & {
  children?: ReactNode,
}

export function NumberInputStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: NumberInputStateManagerProps) {
  const machine = useStateMachineController<NumberInputState, NumberInputEvent>(state
    ? {
      state,
      transition: numberInputStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: numberInputStateTransition,
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
  const contextValue = useMemo<NumberInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <NumberInputContext.Provider value={contextValue}>
      {children}
    </NumberInputContext.Provider>
  )
}
