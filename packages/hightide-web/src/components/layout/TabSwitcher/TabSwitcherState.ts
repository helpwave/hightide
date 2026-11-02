export type TabSwitcherVariant = 'underline' | 'segmented-chips'

export type TabSwitcherState = {
  activeId: string | null,
}

export type TabSwitcherEvent = {
  type: 'select',
  id: string | null,
}

export function tabSwitcherStateTransition(
  state: TabSwitcherState,
  event: TabSwitcherEvent
): TabSwitcherState {
  switch (event.type) {
  case 'select':
    return { ...state, activeId: event.id }
  }
}
