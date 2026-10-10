export type TextareaState = {
  value: string,
}

export type TextareaEvent =
  | { type: 'change', value: string }
  | { type: 'focus' }
  | { type: 'blur' }
  | { type: 'compositionStart' }
  | { type: 'compositionEnd' }

export const textareaStateTransition = (state: TextareaState, event: TextareaEvent): TextareaState => {
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
