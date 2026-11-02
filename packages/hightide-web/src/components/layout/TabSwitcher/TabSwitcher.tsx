import type { PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { TabSwitcherContext } from './TabSwitcherContext'
import { TabSwitcherLayout } from './TabSwitcherLayout'
import { TabSwitcherStateManager } from './TabSwitcherStateManager'
import type { TabSwitcherState, TabSwitcherVariant } from './TabSwitcherState'
import { TabSwitcherTabList } from './TabSwitcherTabList'
import { TabSwitcherTabPanel } from './TabSwitcherTabPanel'

export type TabSwitcherProps = PropsWithChildren & {
  activeId?: string,
  onActiveIdChange?: (activeId: string | null) => void,
  initialActiveId?: string,
  variant?: TabSwitcherVariant,
}

const TabSwitcherComponent = ({
  children,
  activeId,
  onActiveIdChange,
  initialActiveId,
  variant = 'underline',
}: TabSwitcherProps) => {
  const [state, setState] = useControlledState<TabSwitcherState>({
    defaultValue: { activeId: initialActiveId ?? null },
  })
  const binding = useStateMachineBinding<TabSwitcherState, string | null>({
    state,
    onStateChange: setState,
    onValueChange: onActiveIdChange,
    value: activeId,
    inject: useCallback((next: string | null) => ({ activeId: next }), []),
    get: useCallback((current: TabSwitcherState) => current.activeId, []),
  })

  return (
    <TabSwitcherStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      variant={variant}
    >
      <TabSwitcherLayout>
        {children}
      </TabSwitcherLayout>
    </TabSwitcherStateManager>
  )
}

export const TabSwitcher = Object.assign(TabSwitcherComponent, {
  StateManager: TabSwitcherStateManager,
  Layout: TabSwitcherLayout,
  TabList: TabSwitcherTabList,
  TabPanel: TabSwitcherTabPanel,
  Context: TabSwitcherContext,
  Provider: TabSwitcherContext.Provider,
  Consumer: TabSwitcherContext.Consumer,
})
