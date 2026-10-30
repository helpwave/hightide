import type {
  InputConfig,
  InputState,
  InputStateEvent,
  StateManagerProps
} from '@helpwave/hightide-utils/interfaces'

export type {
  InputState,
  InputStateEvent,
}

export interface DOMInputConfig extends InputConfig {
  id?: string,
}

export interface DOMInputContextValue<
  T extends InputState,
  E extends InputStateEvent,
  C extends DOMInputConfig = DOMInputConfig
> {
  state: T,
  dispatch: (event: E) => void,
  config: C,
}

export interface ControllableDOMInputProps<T, E extends InputStateEvent> extends Partial<DOMInputConfig> {
  value?: T,
  initialValue?: T,
  onValueChange?: (value: T) => void,
  onStateEvent?: (event: E) => void,
}

export interface DOMInputStateMangerProps<T extends InputState, E extends InputStateEvent> extends
  Partial<DOMInputConfig>,
  StateManagerProps<T, E> { }
