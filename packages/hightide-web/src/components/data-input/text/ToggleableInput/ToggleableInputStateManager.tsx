import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { ToggleableInputContext, type ToggleableInputContextValue } from './ToggleableInputContext'
import {
  toggleableInputStateTransition,
  type ToggleableInputEvent,
  type ToggleableInputState
} from './ToggleableInputState'

export type ToggleableInputStateManagerProps = DOMInputStateMangerProps<ToggleableInputState, ToggleableInputEvent>

export function ToggleableInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: ToggleableInputStateManagerProps) {
  const machine = useStateMachine({
    state,
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
