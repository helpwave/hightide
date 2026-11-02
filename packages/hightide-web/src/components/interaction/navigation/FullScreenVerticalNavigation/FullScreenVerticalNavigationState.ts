export type FullScreenVerticalNavigationState = {
  isOpen: boolean,
}

export type FullScreenVerticalNavigationEvent = {
  type: 'open' | 'close' | 'toggle',
}

export const fullScreenVerticalNavigationStateTransition = (
  state: FullScreenVerticalNavigationState,
  event: FullScreenVerticalNavigationEvent
): FullScreenVerticalNavigationState => {
  switch (event.type) {
  case 'open':
    return { isOpen: true }
  case 'close':
    return { isOpen: false }
  case 'toggle':
    return { isOpen: !state.isOpen }
  }
}
