import type { PropsWithChildren } from 'react'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { TabSwitcherContext } from './TabSwitcherContext'
import { TabSwitcherLayout } from './TabSwitcherLayout'
import { TabSwitcherStateManager } from './TabSwitcherStateManager'
import {
  type TabSwitcherState,
  type TabSwitcherVariant
} from './TabSwitcherState'
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
  const store = useStateStore<TabSwitcherState>({
    activeId: activeId ?? initialActiveId ?? null,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      activeId: { value: activeId, onValueChange: onActiveIdChange },
    },
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
