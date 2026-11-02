export type NumberStepperInputState = {
  value: number,
}

export type NumberStepperInputEvent =
  | { type: 'change', value: number }
  | { type: 'commit', value: number }

export function numberStepperInputStateTransition(
  state: NumberStepperInputState,
  event: NumberStepperInputEvent
): NumberStepperInputState {
  switch (event.type) {
  case 'change':
  case 'commit':
    return { ...state, value: event.value }
  }
}
