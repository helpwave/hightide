import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { ToggleableInputContext, type ToggleableInputContextValue } from './ToggleableInputContext'
import {
  toggleableInputStateTransition,
  type ToggleableInputEvent,
  type ToggleableInputState
} from './ToggleableInputState'

export type ToggleableInputStateManagerProps = InputStateMangerProps<ToggleableInputState, ToggleableInputEvent> & {
  children?: ReactNode,
}

export function ToggleableInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: ToggleableInputStateManagerProps) {
  const machine = useStateMachine<ToggleableInputState, ToggleableInputEvent>({
    state,
    transition: toggleableInputStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: ToggleableInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<ToggleableInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <ToggleableInputContext.Provider value={contextValue}>
      {children}
    </ToggleableInputContext.Provider>
  )
}
