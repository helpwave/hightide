export type AppPageState = {
  isOpen: boolean,
}

export type AppPageEvent = {
  type: 'open' | 'close' | 'toggle',
}

export const appPageStateTransition = (
  state: AppPageState,
  event: AppPageEvent
): AppPageState => {
  switch (event.type) {
  case 'open':
    return { isOpen: true }
  case 'close':
    return { isOpen: false }
  case 'toggle':
    return { isOpen: !state.isOpen }
  }
}
