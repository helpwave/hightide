import { useCallback, useMemo, useState } from 'react'
import { useStableEvent } from './useStableEvent'

export type StateMachineProps<S, E> = {
  initialState: () => S,
  transition: (state: S, event: E) => S,
  state?: S,
  onStateEvent?: (event: E) => void,
  onStateChange?: (state: S) => void,
}

export type StateMachine<S, E> = {
  state: S,
  dispatch: (event: E) => void,
  controlled: boolean,
}

export function useStateMachine<S, E>({
  initialState,
  transition,
  state: controlledState,
  onStateEvent,
  onStateChange,
}: StateMachineProps<S, E>): StateMachine<S, E> {
  const [internalState, setInternalState] = useState(initialState)

  const isControlled = controlledState !== undefined
  const state = isControlled ? controlledState : internalState

  const transitionStable = useStableEvent(transition)
  const onStateEventStable = useStableEvent(onStateEvent)
  const onStateChangeStable = useStableEvent(onStateChange)

  const dispatch = useCallback((event: E) => {
    onStateEventStable(event)

    const nextState = transitionStable(state, event)

    if (!isControlled) {
      setInternalState(nextState)
    }

    onStateChangeStable(nextState)
  }, [isControlled, onStateChangeStable, onStateEventStable, state, transitionStable])

  return useMemo(() => ({
    state,
    dispatch,
    controlled: isControlled,
  }), [isControlled, dispatch, state])
}
