import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useStableEvent } from './useStableEvent'

export type StateMachineBindingProps<T, V> = {
  state: T,
  onStateChange?: (state: T) => void,
  onValueChange?: (value: V) => void,
  inject: (value: V) => Partial<T>,
  value?: V,
  get: (state: T) => V,
}

export type StateMachineBindingResult<T> = {
  state: T,
  onStateChange: (state: T) => void,
}

export function useStateMachineBinding<T, V>({
  state,
  onStateChange,
  onValueChange,
  inject,
  value,
  get,
}: StateMachineBindingProps<T, V>): StateMachineBindingResult<T> {
  const isActive = value !== undefined
  const onStateChangeStable = useStableEvent(onStateChange)
  const onValueChangeStable = useStableEvent(onValueChange)
  const previousValueRef = useRef(value)

  useEffect(() => {
    if(value != undefined)
      previousValueRef.current = value
  }, [value])

  const nextState = useMemo(() => {
    if(isActive) {
      return{ ...state, ...inject(value) }
    }
    return state
  }, [inject, isActive, state, value])

  const handleStateChange = useCallback((newState: T) => {
    const nextValue = get(newState)
    if (nextValue !== previousValueRef.current) {
      onValueChangeStable(nextValue)
    }
    previousValueRef.current = nextValue
    onStateChangeStable(newState)
  }, [get, onStateChangeStable, onValueChangeStable])

  return useMemo(() => ({
    state: nextState,
    onStateChange: handleStateChange,
  }), [handleStateChange, nextState])
}
