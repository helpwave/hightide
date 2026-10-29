import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { NumberInputContext, type NumberInputContextValue } from './NumberInputContext'
import { numberInputStateTransition, type NumberInputEvent, type NumberInputState } from './NumberInputState'

export type NumberInputStateManagerProps = InputStateMangerProps<NumberInputState, NumberInputEvent> & {
  children?: ReactNode,
}

export function NumberInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: NumberInputStateManagerProps) {
  const machine = useStateMachine<NumberInputState, NumberInputEvent>({
    state,
    transition: numberInputStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: NumberInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<NumberInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <NumberInputContext.Provider value={contextValue}>
      {children}
    </NumberInputContext.Provider>
  )
}
