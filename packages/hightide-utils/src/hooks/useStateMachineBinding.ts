import { useCallback } from 'react'

export type StateMachineBinding<S, V, E> = {
  get: (state: S) => V,
  set: (value: V) => E,
}

export type StateMachineBindingOptions<S, V, E> = {
  state: S,
  dispatch: (event: E) => void,
  binding: StateMachineBinding<S, V, E>,
  value?: V,
  defaultValue: V,
  onChange?: (value: V) => void,
}

export type StateMachineBoundState<V> = {
  value: V,
  setValue: (value: V) => void,
  controlled: boolean,
}

export function useStateMachineBinding<S, V, E>({
  state,
  dispatch,
  binding,
  value: controlledValue,
  onChange,
}: StateMachineBindingOptions<S, V, E>): StateMachineBoundState<V> {
  const value = controlledValue !== undefined
    ? controlledValue
    : binding.get(state)

  const setValue = useCallback((nextValue: V) => {
    onChange?.(nextValue)

    if (controlledValue === undefined) {
      dispatch(binding.set(nextValue))
    }
  }, [
    controlledValue,
    dispatch,
    binding,
    onChange,
  ])

  return {
    value,
    setValue,
    controlled: controlledValue !== undefined,
  }
}
