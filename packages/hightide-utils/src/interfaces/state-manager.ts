import type { StateStore } from './state-store'

export type StateManagerProps<T, E> = {
  state: StateStore<T>,
  onStateChange?: (state: T) => void,
  onStateEvent?: (event: E) => void,
}
