import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
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
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: InsideLabelInputStateManagerProps) {
  const machine = useStateMachine<InsideLabelInputState, InsideLabelInputEvent>({
    state,
    transition: insideLabelInputStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: InsideLabelInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<InsideLabelInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <InsideLabelInputContext.Provider value={contextValue}>
      {children}
    </InsideLabelInputContext.Provider>
  )
}
