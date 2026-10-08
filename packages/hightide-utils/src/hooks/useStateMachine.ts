import { useCallback, useMemo } from 'react'
import { useStableEvent } from './useStableEvent'

export type StateMachineProps<S, E> = {
  state: S,
  transition: (state: S, event: E) => S,
  onStateChange?: (state: S) => void,
}

export type StateMachine<S, E> = {
  state: S,
  dispatch: (event: E) => void,
}

export function useStateMachine<S, E>({
  state,
  transition,
  onStateChange,
}: StateMachineProps<S, E>): StateMachine<S, E> {
  const transitionStable = useStableEvent(transition)
  const onStateChangeStable = useStableEvent(onStateChange)

  const dispatch = useCallback((event: E) => {
    const nextState = transitionStable(state, event)
    onStateChangeStable(nextState)
  }, [onStateChangeStable, state, transitionStable])

  return useMemo(() => ({
    state,
    dispatch,
  }), [dispatch, state])
}
