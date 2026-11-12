import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStateManager } from '@helpwave/hightide-utils/hooks'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { TabSwitcherContext, type TabInfo } from './TabSwitcherContext'
import {
  tabSwitcherStateTransition,
  type TabSwitcherEvent,
  type TabSwitcherState,
  type TabSwitcherVariant
} from './TabSwitcherState'
import { DOMUtils } from '../../../utils'

function sortByDomOrder(infos: TabInfo[]): TabInfo[] {
  return infos.slice().sort((left, right) => {
    const leftElement = left.ref.current
    const rightElement = right.ref.current
    return DOMUtils.compareDocumentPosition(leftElement, rightElement)
  })
}

export type TabSwitcherStateManagerProps = StateManagerProps<TabSwitcherState, TabSwitcherEvent> & {
  variant?: TabSwitcherVariant,
}

export function TabSwitcherStateManager({
  state,
  onStateChange,
  onStateEvent,
  variant = 'underline',
  children,
}: TabSwitcherStateManagerProps) {
  const [tabInfos, setTabInfos] = useState<TabInfo[]>([])
  const machine = useStateManager({
    state,
    initialState: { activeId: null },
    transition: tabSwitcherStateTransition,
    onStateChange,
    onStateEvent,
  })

  const unsubscribe = useCallback((id: string) => {
    setTabInfos((previous) => previous.filter((tab) => tab.id !== id))
  }, [])

  const subscribe = useCallback((info: TabInfo) => {
    const id = info.id
    setTabInfos((previous) => {
      const existingIndex = previous.findIndex((tab) => tab.id === id)
      const infos = existingIndex >= 0
        ? previous.map((tab, index) => (index === existingIndex ? { ...tab, ...info } : tab))
        : [...previous, info]
      return sortByDomOrder(infos)
    })
    return () => unsubscribe(id)
  }, [unsubscribe])

  const dispatch = useCallback((event: TabSwitcherEvent) => {
    if (event.type === 'select' && event.id !== null && tabInfos.find((tab) => tab.id === event.id)?.disabled) {
      return
    }
    machine.dispatch(event)
  }, [machine, tabInfos])

  const activeId = useMemo(() => {
    const active = tabInfos.find((tab) => tab.id === machine.state.activeId)
    if (active && !active.disabled) return machine.state.activeId
    const firstEnabled = tabInfos.find((tab) => !tab.disabled)
    if (firstEnabled) return firstEnabled.id
    return machine.state.activeId
  }, [machine.state.activeId, tabInfos])

  useEffect(() => {
    const active = tabInfos.find((tab) => tab.id === machine.state.activeId)
    if (!active?.disabled) return
    const firstEnabled = tabInfos.find((tab) => !tab.disabled)
    if (!firstEnabled || firstEnabled.id === machine.state.activeId) return
    onStateChange?.({ activeId: firstEnabled.id }, {
      event: { type: 'select', id: firstEnabled.id },
      previousState: machine.state,
    })
  }, [machine.state, onStateChange, tabInfos])

  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch,
    config: { variant },
    tabs: {
      activeId,
      infos: tabInfos,
      subscribe,
      unsubscribe,
    },
  }), [activeId, dispatch, machine.state, subscribe, tabInfos, unsubscribe, variant])

  return (
    <TabSwitcherContext.Provider value={contextValue}>
      {children}
    </TabSwitcherContext.Provider>
  )
}
