import type { StateStore } from '../../interfaces/state-store'
import type { StateMachine } from './useStateMachine'
import { useStateMachine } from './useStateMachine'
import { useResolvedStateStore } from './useResolvedStateStore'
import type {
  StateStoreBindings,
  StateStoreChange,
  StateTransitionInformation
} from './useStateStoreBindings'
import { useStateStoreBindings } from './useStateStoreBindings'

export type UseStateManagerProps<S extends object, E> = {
  state?: StateStore<S>,
  initialState: S | (() => S),
  transition: (state: S, event: E) => S,
  bindings?: StateStoreBindings<S, E>,
  onStateChange?: (state: S, transition?: StateTransitionInformation<S, E>) => StateStoreChange<S> | void,
  onStateEvent?: (event: E) => void,
}

export type StateManager<S, E> = StateMachine<S, E> & {
  store: StateStore<S>,
}

export function useStateManager<S extends object, E>({
  state,
  initialState,
  transition,
  bindings,
  onStateChange,
  onStateEvent,
}: UseStateManagerProps<S, E>): StateManager<S, E> {
  const store = useResolvedStateStore(state, initialState)
  const commit = useStateStoreBindings({
    store,
    bindings: bindings ?? {},
    onStateChange,
  })
  const machine = useStateMachine({
    state: store,
    transition,
    onStateChange: commit,
    onStateEvent,
  })

  return {
    store,
    state: machine.state,
    dispatch: machine.dispatch,
  }
}
