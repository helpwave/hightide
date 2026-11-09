import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { InsideLabelInputContext, type InsideLabelInputContextValue } from './InsideLabelInputContext'
import {
  insideLabelInputStateTransition,
  type InsideLabelInputEvent,
  type InsideLabelInputState
} from './InsideLabelInputState'

export type InsideLabelInputStateManagerProps = DOMInputStateMangerProps<InsideLabelInputState, InsideLabelInputEvent> & {
  children?: ReactNode,
}

export function InsideLabelInputStateManager({
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
}: InsideLabelInputStateManagerProps) {
  const machine = useStateMachineController<InsideLabelInputState, InsideLabelInputEvent>(state
    ? {
      state,
      transition: insideLabelInputStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
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
