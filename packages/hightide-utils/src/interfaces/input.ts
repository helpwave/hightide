import type { StateManagerProps } from './state-manager'

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

export interface ControllableInputProps<T, E extends InputStateEvent> extends Partial<InputConfig> {
  value?: T,
  initialValue?: T,
  onValueChange?: (value: T) => void,
  onStateEvent?: (event: E) => void,
}

export interface InputStateMangerProps<T extends InputState, E extends InputStateEvent> extends
  Partial<InputConfig>,
  StateManagerProps<T, E> {}