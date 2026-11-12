import type { ReactNode } from 'react'
import type { BindingTransitionInformation, StateStoreBindings, StateStoreChange } from '../hooks/state-machine/useStateStoreBindings'
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

export type InputStateManagerProps<TState extends InputState, E extends InputStateEvent> =
  Omit<StateManagerProps<TState, E>, 'children' | 'initialState'> & {
    value?: TState['value'],
    initialValue?: TState['value'],
    onValueChange?: (
      value: TState['value'],
      transition?: BindingTransitionInformation<TState, 'value', E>,
    ) => StateStoreChange<TState['value']> | void,
    children?: ReactNode,
  }

export type InputStateManagerHookProps<TState extends InputState, E extends InputStateEvent> =
  Omit<InputStateManagerProps<TState, E>, 'children'> & {
    transition: (state: TState, event: E) => TState,
    initialState: TState | ((value: TState['value'] | undefined) => TState),
    bindings?: StateStoreBindings<TState, E>,
  }
