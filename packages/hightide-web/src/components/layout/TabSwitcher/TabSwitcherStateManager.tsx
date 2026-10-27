import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { TabSwitcherContext, type TabInfo } from './TabSwitcherContext'
import {
  tabSwitcherStateTransition,
  type TabSwitcherEvent,
  type TabSwitcherState,
  type TabSwitcherVariant
} from './TabSwitcherState'

function sortByDomOrder(infos: TabInfo[]): TabInfo[] {
  return infos.slice().sort((left, right) => {
    const leftElement = left.ref.current
    const rightElement = right.ref.current
    if (!leftElement && !rightElement) return 0
    if (!leftElement) return 1
    if (!rightElement) return -1
    return (leftElement.compareDocumentPosition(rightElement) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1
  })
}

export type TabSwitcherStateManagerProps = {
  state: TabSwitcherState,
  onStateChange?: (state: TabSwitcherState) => void,
  variant?: TabSwitcherVariant,
  children?: ReactNode,
}

export function TabSwitcherStateManager({
  state,
  onStateChange,
  variant = 'underline',
  children,
}: TabSwitcherStateManagerProps) {
  const [tabInfos, setTabInfos] = useState<TabInfo[]>([])
  const machine = useStateMachine({
    state,
    transition: tabSwitcherStateTransition,
    onStateChange,
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
    const active = tabInfos.find((tab) => tab.id === state.activeId)
    if (active && !active.disabled) return state.activeId
    const firstEnabled = tabInfos.find((tab) => !tab.disabled)
    if (firstEnabled) return firstEnabled.id
    return state.activeId
  }, [state.activeId, tabInfos])

  useEffect(() => {
    const active = tabInfos.find((tab) => tab.id === state.activeId)
    if (!active?.disabled) return
    const firstEnabled = tabInfos.find((tab) => !tab.disabled)
    if (!firstEnabled || firstEnabled.id === state.activeId) return
    onStateChange?.({ activeId: firstEnabled.id })
  }, [onStateChange, state.activeId, tabInfos])

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    config: { variant },
    tabs: {
      activeId,
      infos: tabInfos,
      subscribe,
      unsubscribe,
    },
  }), [activeId, dispatch, state, subscribe, tabInfos, unsubscribe, variant])

  return (
    <TabSwitcherContext.Provider value={contextValue}>
      {children}
    </TabSwitcherContext.Provider>
  )
}
