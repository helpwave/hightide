import { useCallback, useEffect, useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { useStableEvent } from '../useStableEvent'
import type { StateMachine } from './useStateMachine'
import { useStateMachine } from './useStateMachine'
import { useStateStore } from './useStateStore'

export type StateMachineControllerProps<S, E> = {
  transition: (state: S, event: E) => S,
  onStateChange?: (state: S) => void,
  onStateEvent?: (event: E) => void,
} & (
  | {
    state?: undefined,
    initialState: S,
  }
  | {
    state: StateStore<S>,
    initialState?: undefined,
  }
)

export function useStateMachineController<S, E>({
  state,
  initialState,
  transition,
  onStateChange,
  onStateEvent,
}: StateMachineControllerProps<S, E>): StateMachine<S, E> {
  const owned = useStateStore<S>(() => initialState as S)
  const stateRef = useRef(state)
  const onStateChangeStable = useStableEvent(onStateChange)

  useEffect(() => {
    if (stateRef.current !== undefined && state === undefined)
      console.error('useStateMachineController: state must be stably controlled or uncontrolled and cannot change its usage mode.')
    stateRef.current = state
  }, [state])

  const commit = useCallback((next: S) => {
    if (stateRef.current === undefined) {
      owned.set(next)
    }
    onStateChangeStable(next)
  }, [onStateChangeStable, owned])

  const activeState = state ?? owned

  return useStateMachine({
    state: activeState,
    transition,
    onStateChange: commit,
    onStateEvent,
  })
}
