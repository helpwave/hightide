import { useCallback, useState } from 'react'

export type StateMachineDefinition<S, E> = {
  initialState: () => S,
  transition: (state: S, event: E) => S,
}

export type StateMachineOptions<S, E> = {
  state?: S,
  onStateEvent?: (event: E) => void,
  onStateChange?: (state: S) => void,
}

export type StateMachine<S, E> = {
  state: S,
  dispatch: (event: E) => void,
  controlled: boolean,
}

export function useStateMachine<S, E>(
  definition: StateMachineDefinition<S, E>,
  options: StateMachineOptions<S, E> = {}
): StateMachine<S, E> {
  const {
    state: controlledState,
    onStateEvent,
    onStateChange,
  } = options

  const [internalState, setInternalState] = useState(definition.initialState)

  const controlled = controlledState !== undefined
  const state = controlled ? controlledState : internalState

  const dispatch = useCallback((event: E) => {
    onStateEvent?.(event)

    const nextState = definition.transition(state, event)

    if (!controlled) {
      setInternalState(nextState)
    }

    onStateChange?.(nextState)
  }, [
    state,
    controlled,
    definition,
    onStateEvent,
    onStateChange,
  ])

  return {
    state,
    dispatch,
    controlled,
  }
}
