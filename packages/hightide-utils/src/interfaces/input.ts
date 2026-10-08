import type { ControllableStateProps } from './controllable-state'

export interface InputState { value: unknown }
export interface InputStateEvent { type: string }
export interface InputConfig {
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
}
export interface InputContextValue<T extends InputState, E extends InputStateEvent, C extends InputConfig = InputConfig> {
  state: T,
  dispatch: (event: E) => void,
  config: C,
}

export interface ControllableInputProps<T> extends Partial<InputConfig> {
  value?: T,
  initialValue?: T,
  onValueChange?: (value: T) => void,
}

export interface ControllableStateInputProps<T extends InputState, E extends InputStateEvent> extends
  ControllableInputProps<T['value']>,
  ControllableStateProps<T, E> {}