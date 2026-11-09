import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { ToggleableInputContext, type ToggleableInputContextValue } from './ToggleableInputContext'
import {
  toggleableInputStateTransition,
  type ToggleableInputEvent,
  type ToggleableInputState
} from './ToggleableInputState'

export type ToggleableInputStateManagerProps = DOMInputStateMangerProps<ToggleableInputState, ToggleableInputEvent> & {
  children?: ReactNode,
}

export function ToggleableInputStateManager({
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
}: ToggleableInputStateManagerProps) {
  const machine = useStateMachineController<ToggleableInputState, ToggleableInputEvent>(state
    ? {
      state,
      transition: toggleableInputStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: toggleableInputStateTransition,
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
  const contextValue = useMemo<ToggleableInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <ToggleableInputContext.Provider value={contextValue}>
      {children}
    </ToggleableInputContext.Provider>
  )
}
