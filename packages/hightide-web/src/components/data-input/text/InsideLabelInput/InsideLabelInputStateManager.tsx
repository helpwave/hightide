import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { InsideLabelInputContext, type InsideLabelInputContextValue } from './InsideLabelInputContext'
import {
  insideLabelInputStateTransition,
  type InsideLabelInputEvent,
  type InsideLabelInputState
} from './InsideLabelInputState'

export type InsideLabelInputStateManagerProps = DOMInputStateMangerProps<InsideLabelInputState, InsideLabelInputEvent>

export function InsideLabelInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: InsideLabelInputStateManagerProps) {
  const machine = useStateMachine({
    state,
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
  }), [config, machine.dispatch, machine.state])

  return (
    <InsideLabelInputContext.Provider value={contextValue}>
      {children}
    </InsideLabelInputContext.Provider>
  )
}
