export type SearchBarState = {
  value: string,
}

export type SearchBarEvent =
  | { type: 'change', value: string }
  | { type: 'commit', value: string }

export function searchBarStateTransition(state: SearchBarState, event: SearchBarEvent): SearchBarState {
  switch (event.type) {
  case 'change':
  case 'commit':
    return { ...state, value: event.value }
  }
}
