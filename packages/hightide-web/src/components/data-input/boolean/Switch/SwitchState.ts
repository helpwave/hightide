export type SwitchState = {
  value: boolean,
}

export type SwitchEvent = {
  type: 'toggle',
}

export const switchStateTransition = (state: SwitchState, event: SwitchEvent): SwitchState => {
  switch (event.type) {
  case 'toggle':
    return { value: !state.value }
  }
}
