import type { ReactNode } from 'react'
import { useControllableStateStore, useStateStoreBinding } from '@helpwave/hightide-utils/hooks'
import { MenuContent, type MenuContentProps } from './MenuContent'
import { MenuContext } from './MenuContext'
import { MenuItem } from './MenuItem'
import { MenuNavigationItem } from './MenuNavigationItem'
import type { MenuEvent, MenuState } from './MenuState'
import { MenuStateManager } from './MenuStateManager'
import { MenuTrigger, type MenuTriggerProps } from './MenuTrigger'

export type MenuProps = {
  children?: ReactNode,
  isOpen?: boolean,
  initialIsOpen?: boolean,
  onStateChange?: (state: MenuState) => void,
  onStateEvent?: (event: MenuEvent) => void,
  disabled?: boolean,
  trigger: MenuTriggerProps['children'],
  triggerProps?: Partial<MenuTriggerProps>,
  contentProps?: MenuContentProps,
}

const MenuComponent = ({
  children,
  isOpen,
  initialIsOpen = false,
  onStateChange,
  onStateEvent,
  disabled = false,
  trigger,
  triggerProps,
  contentProps,
}: MenuProps) => {
  const { store, onStateChange: commitState } = useControllableStateStore<MenuState>({
    initialState: { isOpen: initialIsOpen },
    onStateChange,
  })
  useStateStoreBinding({
    store,
    key: 'isOpen',
    value: isOpen,
  })

  return (
    <MenuStateManager
      state={store}
      onStateChange={commitState}
      onStateEvent={onStateEvent}
      disabled={disabled}
    >
      <MenuTrigger {...{ children: trigger, ...triggerProps }} />
      <MenuContent {...{ children, ...contentProps }} />
    </MenuStateManager>
  )
}

export const Menu = Object.assign(MenuComponent, {
  StateManager: MenuStateManager,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  NavigationItem: MenuNavigationItem,
  Context: MenuContext,
  Provider: MenuContext.Provider,
  Consumer: MenuContext.Consumer,
})
