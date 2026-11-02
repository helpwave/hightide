export type TextareaState = {
  value: string,
}

export type TextareaEvent =
  | { type: 'change', value: string }
  | { type: 'focus' }
  | { type: 'blur' }

export const textareaStateTransition = (state: TextareaState, event: TextareaEvent): TextareaState => {
  switch (event.type) {
  case 'change':
    return { value: event.value }
  case 'focus':
  case 'blur':
    return state
  }
}
