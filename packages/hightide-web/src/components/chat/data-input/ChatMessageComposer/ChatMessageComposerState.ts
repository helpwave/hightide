export type ChatMessageComposerState = {
  value: string,
}

export type ChatMessageComposerEvent =
  | { type: 'change', value: string }
  | { type: 'blur' }
  | { type: 'send', value: string }

export function chatMessageComposerStateTransition(
  state: ChatMessageComposerState,
  event: ChatMessageComposerEvent
): ChatMessageComposerState {
  switch (event.type) {
  case 'change':
    return { ...state, value: event.value }
  case 'blur':
    return state
  case 'send':
    return { ...state, value: '' }
  }
}
