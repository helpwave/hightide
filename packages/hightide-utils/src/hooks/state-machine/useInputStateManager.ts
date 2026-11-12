import type { InputState, InputStateEvent, InputStateManagerHookProps } from '../../interfaces/input'
import type { StateStoreBindings } from './useStateStoreBindings'
import { useStateManager } from './useStateManager'

function resolveInputInitialState<TState extends InputState>(
  initialState: TState | ((value: TState['value'] | undefined) => TState),
  value: TState['value'] | undefined,
  initialValue: TState['value'] | undefined
): TState {
  const seeded = value !== undefined ? value : initialValue
  const base = typeof initialState === 'function' ? initialState(seeded) : initialState
  if (seeded === undefined) {
    return base
  }
  return { ...base, value: seeded }
}

export function useInputStateManager<TState extends InputState, E extends InputStateEvent>({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  transition,
  initialState,
  bindings,
}: InputStateManagerHookProps<TState, E>) {
  const extraBindings = bindings ?? {}
  const valueBindings = {
    ...extraBindings,
    value: { value, onValueChange },
  } as StateStoreBindings<TState, E>

  return useStateManager<TState, E>({
    state,
    initialState: () => resolveInputInitialState(initialState, value, initialValue),
    transition,
    onStateChange,
    onStateEvent,
    bindings: valueBindings,
  })
}
