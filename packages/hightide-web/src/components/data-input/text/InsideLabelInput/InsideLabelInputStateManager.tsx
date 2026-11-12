import { useId, useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { InsideLabelInputContext, type InsideLabelInputContextValue } from './InsideLabelInputContext'
import {
  insideLabelInputStateTransition,
  type InsideLabelInputEvent,
  type InsideLabelInputState
} from './InsideLabelInputState'

export type InsideLabelInputStateManagerProps = DOMInputStateManagerProps<InsideLabelInputState, InsideLabelInputEvent>

export function InsideLabelInputStateManager({
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
  id: customId,
  children,
}: InsideLabelInputStateManagerProps) {
  const generatedId = useId()
  const id = customId ?? generatedId
  const labelId = id + '-label'
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: '', isFocused: false },
    transition: insideLabelInputStateTransition,
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
  const contextValue = useMemo<InsideLabelInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    labelId,
  }), [config, labelId, machine.dispatch, machine.state])

  return (
    <InsideLabelInputContext.Provider value={contextValue}>
      {children}
    </InsideLabelInputContext.Provider>
  )
}
