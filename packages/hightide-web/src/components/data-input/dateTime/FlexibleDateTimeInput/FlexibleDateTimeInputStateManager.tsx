import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStableEvent } from '@helpwave/hightide-utils/hooks'
import { FlexibleDateTimeInputContext, type FlexibleDateTimeInputContextValue } from './FlexibleDateTimeInputContext'
import {
  flexibleDateTimeInputStateTransition,
  type FlexibleDateTimeInputEvent,
  type FlexibleDateTimeInputState
} from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputStateManagerProps = DOMInputStateMangerProps<FlexibleDateTimeInputState, FlexibleDateTimeInputEvent> & {
  children?: ReactNode,
}

export function FlexibleDateTimeInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: FlexibleDateTimeInputStateManagerProps) {
  const onStateChangeStable = useStableEvent(onStateChange)
  const onStateEventStable = useStableEvent(onStateEvent)
  const latestStateRef = useRef(state)
  if (state.mode === latestStateRef.current.mode) {
    latestStateRef.current = state
  }
  const dispatch = useCallback((event: FlexibleDateTimeInputEvent) => {
    const current = latestStateRef.current
    const nextState = flexibleDateTimeInputStateTransition(current, event)
    if (nextState === current) return
    latestStateRef.current = nextState
    onStateChangeStable(nextState)
    onStateEventStable(event)
  }, [onStateChangeStable, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<FlexibleDateTimeInputContextValue>(() => ({
    state,
    dispatch,
    config,
  }), [config, dispatch, state])

  return (
    <FlexibleDateTimeInputContext.Provider value={contextValue}>
      {children}
    </FlexibleDateTimeInputContext.Provider>
  )
}
