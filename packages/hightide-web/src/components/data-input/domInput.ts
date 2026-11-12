import type { StateStoreChange } from '@helpwave/hightide-utils/hooks'
import type {
  InputConfig,
  InputState,
  InputStateEvent,
  InputStateManagerProps
} from '@helpwave/hightide-utils/interfaces'

export type {
  InputState,
  InputStateEvent,
  InputStateManagerProps,
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

export type DOMInputStateManagerProps<T extends InputState, E extends InputStateEvent> =
  Partial<DOMInputConfig> &
  InputStateManagerProps<T, E>

export type DOMInputValueProps<TValue, TEvent extends InputStateEvent = InputStateEvent> = Partial<DOMInputConfig> & {
  value?: TValue,
  initialValue?: TValue,
  onValueChange?: (value: TValue) => StateStoreChange<TValue> | void,
  onStateEvent?: (event: TEvent) => void,
}
