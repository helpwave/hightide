import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { TabSwitcherEvent, TabSwitcherState, TabSwitcherVariant } from './TabSwitcherState'

export type TabInfo = {
  id: string,
  labelId: string,
  label: ReactNode,
  disabled?: boolean,
  ref: RefObject<HTMLElement | null>,
}

export type TabSwitcherConfig = {
  variant: TabSwitcherVariant,
}

export type TabSwitcherContextValue = {
  state: TabSwitcherState,
  dispatch: (event: TabSwitcherEvent) => void,
  config: TabSwitcherConfig,
  tabs: {
    activeId: string | null,
    infos: TabInfo[],
    subscribe: (info: TabInfo) => () => void,
    unsubscribe: (id: string) => void,
  },
}

export const TabSwitcherContext = createContext<TabSwitcherContextValue | null>(null)

export function useTabSwitcherContext(): TabSwitcherContextValue {
  const context = useContext(TabSwitcherContext)
  if (!context) throw new Error('useTabSwitcherContext must be used inside a TabSwitcher.StateManager')
  return context
}

export function useTabContext(): TabSwitcherContextValue {
  return useTabSwitcherContext()
}
