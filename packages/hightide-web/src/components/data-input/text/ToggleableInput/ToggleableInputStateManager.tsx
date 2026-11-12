import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { ToggleableInputContext, type ToggleableInputContextValue } from './ToggleableInputContext'
import {
  toggleableInputStateTransition,
  type ToggleableInputEvent,
  type ToggleableInputState
} from './ToggleableInputState'

export type ToggleableInputStateManagerProps = DOMInputStateManagerProps<ToggleableInputState, ToggleableInputEvent> & {
  initialEditingState?: 'editing' | 'display',
}

export function ToggleableInputStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  initialEditingState = 'display',
  children,
}: ToggleableInputStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: '', isEditing: initialEditingState !== 'display' },
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
