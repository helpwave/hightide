export type CheckboxState = {
  value: boolean,
}

export type CheckboxEvent = {
  type: 'toggle',
}

export const checkboxStateTransition = (state: CheckboxState, event: CheckboxEvent): CheckboxState => {
  switch (event.type) {
  case 'toggle':
    return { value: !state.value }
  }
}
