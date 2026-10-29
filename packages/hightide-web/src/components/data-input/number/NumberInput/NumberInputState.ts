export type NumberInputState = {
  value: number,
}

export type NumberInputEvent =
  | { type: 'change', value: number }
  | { type: 'commit', value: number }

export function numberInputStateTransition(state: NumberInputState, event: NumberInputEvent): NumberInputState {
  switch (event.type) {
  case 'change':
  case 'commit':
    return { ...state, value: event.value }
  }
}
