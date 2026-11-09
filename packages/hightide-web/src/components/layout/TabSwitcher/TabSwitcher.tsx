import type { PropsWithChildren } from 'react'
import { useControllableStateStore, useStateStoreBinding } from '@helpwave/hightide-utils/hooks'
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
  const { store, onStateChange } = useControllableStateStore<TabSwitcherState>({
    initialState: { activeId: initialActiveId ?? null },
  })
  useStateStoreBinding({
    store,
    key: 'activeId',
    value: activeId,
    onValueChange: onActiveIdChange,
  })

  return (
    <TabSwitcherStateManager
      state={store}
      onStateChange={onStateChange}
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
