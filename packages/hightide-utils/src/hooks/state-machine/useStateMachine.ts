import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { useStableEvent } from '../useStableEvent'

export type StateMachineProps<S, E> = {
  state: StateStore<S>,
  transition: (state: S, event: E) => S,
  onStateChange?: (state: S) => void,
  onStateEvent?: (event: E) => void,
}

export type StateMachine<S, E> = {
  state: S,
  dispatch: (event: E) => void,
}

export function useStateMachine<S, E>({
  state,
  transition,
  onStateChange,
  onStateEvent,
}: StateMachineProps<S, E>): StateMachine<S, E> {
  const transitionStable = useStableEvent(transition)
  const onStateChangeStable = useStableEvent(onStateChange)
  const onStateEventStable = useStableEvent(onStateEvent)
  const storeState = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const getSnapshot = state.getSnapshot

  const dispatch = useCallback((event: E) => {
    const current = getSnapshot()
    const next = transitionStable(current, event)
    onStateChangeStable(next)
    onStateEventStable(event)
  }, [getSnapshot, onStateChangeStable, onStateEventStable, transitionStable])

  return useMemo(() => ({
    state: storeState,
    dispatch,
  }), [dispatch, storeState])
}
