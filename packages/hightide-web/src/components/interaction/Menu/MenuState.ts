export type MenuState = {
  isOpen: boolean,
}

export type MenuEvent = {
  type: 'open' | 'close' | 'toggle',
}

export const menuStateTransition = (
  state: MenuState,
  event: MenuEvent,
  disabled: boolean
): MenuState => {
  if (disabled && event.type !== 'close') {
    return state
  }
  switch (event.type) {
  case 'open':
    return { isOpen: true }
  case 'close':
    return { isOpen: false }
  case 'toggle':
    return { isOpen: !state.isOpen }
  }
}
