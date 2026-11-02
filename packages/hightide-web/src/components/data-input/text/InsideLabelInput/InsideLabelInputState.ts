export type InsideLabelInputState = {
  value: string,
  isFocused: boolean,
}

export type InsideLabelInputEvent =
  | { type: 'change', value: string }
  | { type: 'focus' }
  | { type: 'blur' }

export function insideLabelInputStateTransition(
  state: InsideLabelInputState,
  event: InsideLabelInputEvent
): InsideLabelInputState {
  switch (event.type) {
  case 'change':
    return { ...state, value: event.value }
  case 'focus':
    return { ...state, isFocused: true }
  case 'blur':
    return { ...state, isFocused: false }
  }
}
