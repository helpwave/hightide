export type PopUpState = {
  isOpen: boolean,
}

export type PopUpEvent = {
  type: 'open' | 'close' | 'toggle',
}

export const popUpStateTransition = (
  state: PopUpState,
  event: PopUpEvent
): PopUpState => {
  switch (event.type) {
  case 'open':
    return { isOpen: true }
  case 'close':
    return { isOpen: false }
  case 'toggle':
    return { isOpen: !state.isOpen }
  }
}
