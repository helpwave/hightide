import type { DateTimeFormat } from '@helpwave/hightide-utils/utils'

export type FlexibleDateTimeMode = Exclude<DateTimeFormat, 'time'>

export type FlexibleDateTimeInputState = {
  value: Date | null,
  mode: FlexibleDateTimeMode,
}

export type FlexibleDateTimeInputEvent =
  | { type: 'setValue', value: Date | null, mode: FlexibleDateTimeMode }
  | { type: 'setMode', mode: FlexibleDateTimeMode, value: Date | null }
  | { type: 'commit', value: Date | null, mode: FlexibleDateTimeMode }

export function flexibleDateTimeInputStateTransition(
  state: FlexibleDateTimeInputState,
  event: FlexibleDateTimeInputEvent
): FlexibleDateTimeInputState {
  switch (event.type) {
  case 'setValue':
    if (event.mode !== state.mode) return state
    return { ...state, value: event.value }
  case 'setMode':
    return { value: event.value, mode: event.mode }
  case 'commit':
    if (event.mode !== state.mode) return state
    return { ...state, value: event.value }
  }
}
