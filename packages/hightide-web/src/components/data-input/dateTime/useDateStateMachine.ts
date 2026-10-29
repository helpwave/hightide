import { useCallback, useMemo, useRef } from 'react'
import type { InputConfig, InputContextValue, InputState, InputStateEvent } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStableEvent, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'

export function dateInputConfig({
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
}: Partial<InputConfig> = {}): InputConfig {
  return {
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }
}

export function useDateStateMachine<S extends InputState, E extends InputStateEvent, C extends InputConfig>({
  state,
  transition,
  onStateChange,
  onStateEvent,
  config,
}: {
  state: S,
  transition: (state: S, event: E) => S,
  onStateChange?: (state: S) => void,
  onStateEvent?: (event: E) => void,
  config: C,
}): InputContextValue<S, E, C> {
  const stateRef = useRef(state)
  stateRef.current = state
  const transitionStable = useStableEvent(transition)
  const onStateChangeStable = useStableEvent(onStateChange)
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: E) => {
    const nextState = transitionStable(stateRef.current, event)
    stateRef.current = nextState
    onStateChangeStable(nextState)
    onStateEventStable(event)
  }, [onStateChangeStable, onStateEventStable, transitionStable])

  return useMemo(() => ({
    state,
    dispatch,
    config,
  }), [config, dispatch, state])
}

export function useBoundDateState<S extends { value: Date }>(
  defaultState: S,
  value: Date | undefined,
  onValueChange?: (value: Date) => void
) {
  const [state, setState] = useControlledState<S>({
    defaultValue: defaultState,
  })

  return useStateMachineBinding<S, Date>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: Date) => ({ value: next }) as Partial<S>, []),
    get: useCallback((current: S) => current.value, []),
  })
}
