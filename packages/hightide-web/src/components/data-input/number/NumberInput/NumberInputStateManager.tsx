import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { NumberInputContext, type NumberInputContextValue } from './NumberInputContext'
import { numberInputStateTransition, type NumberInputEvent, type NumberInputState } from './NumberInputState'

export type NumberInputStateManagerProps = DOMInputStateMangerProps<NumberInputState, NumberInputEvent>

export function NumberInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: NumberInputStateManagerProps) {
  const machine = useStateMachine({
    state,
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
