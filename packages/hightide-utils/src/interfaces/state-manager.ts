import type { ReactNode } from 'react'
import type { StateStoreChange, StateTransitionInformation } from '../hooks/state-machine/useStateStoreBindings'
import type { StateStore } from './state-store'

export type StateManagerProps<T, E> = {
  state?: StateStore<T>,
  initialState?: T | (() => T),
  onStateChange?: (state: T, transition?: StateTransitionInformation<T, E>) => StateStoreChange<T> | void,
  onStateEvent?: (event: E) => void,
  children: ReactNode,
}
