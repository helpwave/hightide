import type { StateMachineBinding } from '@helpwave/hightide-utils/hooks'

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

export const textInputValueBinding: StateMachineBinding<TextInputState, string, TextInputEvent> = {
  get: state => state.value,
  set: value => ({ type: 'change', value }),
}
