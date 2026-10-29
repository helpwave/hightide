export type ToggleableInputState = {
  value: string,
  isEditing: boolean,
}

export type ToggleableInputEvent =
  | { type: 'change', value: string }
  | { type: 'startEditing' }
  | { type: 'commit', value: string }

export function toggleableInputStateTransition(
  state: ToggleableInputState,
  event: ToggleableInputEvent
): ToggleableInputState {
  switch (event.type) {
  case 'change':
    return { ...state, value: event.value }
  case 'startEditing':
    return { ...state, isEditing: true }
  case 'commit':
    return { value: event.value, isEditing: false }
  }
}
