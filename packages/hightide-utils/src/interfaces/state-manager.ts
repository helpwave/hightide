export interface StateManagerProps<T, E> {
  state: T,
  onStateChange?: (state: T) => void,
  onStateEvent?: (event: E) => void,
}
