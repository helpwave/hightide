export type ModalState = {
  isOpen: boolean,
}

export type ModalEvent = {
  type: 'open' | 'close' | 'toggle',
}

export const modalStateTransition = (
  state: ModalState,
  event: ModalEvent
): ModalState => {
  switch (event.type) {
  case 'open':
    return { isOpen: true }
  case 'close':
    return { isOpen: false }
  case 'toggle':
    return { isOpen: !state.isOpen }
  }
}
