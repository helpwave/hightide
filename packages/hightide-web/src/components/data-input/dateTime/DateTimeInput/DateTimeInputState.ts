export type DateTimeInputState = {
  value: Date | null,
  dialogValue: Date | null,
  isOpen: boolean,
}

export type DateTimeInputEvent =
  | { type: 'setValue', value: Date | null }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'commit', value: Date | null }

export function dateTimeInputStateTransition(state: DateTimeInputState, event: DateTimeInputEvent): DateTimeInputState {
  switch (event.type) {
  case 'setValue':
    return { ...state, value: event.value }
  case 'open':
    return { ...state, isOpen: true, dialogValue: state.value }
  case 'close':
    return { ...state, isOpen: false }
  case 'commit':
    return { ...state, value: event.value, dialogValue: event.value, isOpen: false }
  }
}
