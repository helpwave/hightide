export interface ControllableStateProps<T, E> {
  initialState?: T,
  state?: T,
  onStateChange?: (state: T) => void,
  onStateEvent?: (event: E) => void,
}