export type TextInputState = {
  value: string,
}

export type TextInputEvent =
  | { type: 'change', value: string }
  | { type: 'focus' }
  | { type: 'blur' }
  | { type: 'compositionStart' }
  | { type: 'compositionEnd' }

export const textInputStateTransition = (state: TextInputState, event: TextInputEvent): TextInputState => {
  switch (event.type) {
  case 'change':
    return { value: event.value }
  case 'focus':
  case 'blur':
  case 'compositionStart':
  case 'compositionEnd':
    return state
  }
}
