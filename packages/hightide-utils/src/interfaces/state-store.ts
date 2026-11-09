export type StateStore<T> = {
  getSnapshot: () => T,
  set: (value: T) => void,
  subscribe: (listener: () => void) => () => void,
}
