export interface InputStateResolved<T> {
  value?: T,
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
}

export type InputState<T> = Partial<InputStateResolved<T>>

export interface InputStateEvent { type: string }
export type InputStateCommitEvent = { type: 'commit' }
export type InputStateEventAddition<E extends InputStateEvent> = InputStateCommitEvent | E


export interface ControlledInput<T, E extends InputStateEvent> {
  state?: InputState<T>,
  onStateChange?: (state: InputStateResolved<T>) => void,
  onStateEvent?: (event: InputStateEventAddition<E>) => void,
}