import type { ReactNode, RefObject } from 'react'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { MenuContent, type MenuContentProps } from './MenuContent'
import { MenuContext } from './MenuContext'
import { MenuItem } from './MenuItem'
import { MenuNavigationItem } from './MenuNavigationItem'
import { type MenuEvent, type MenuState } from './MenuState'
import { MenuStateManager } from './MenuStateManager'
import { MenuTrigger, type MenuTriggerProps } from './MenuTrigger'

export type MenuProps = {
  children?: ReactNode,
  isOpen?: boolean,
  initialIsOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  onStateEvent?: (event: MenuEvent) => void,
  disabled?: boolean,
  trigger: MenuTriggerProps['children'],
  triggerProps?: Partial<MenuTriggerProps>,
  contentRef?: RefObject<HTMLDivElement | null>,
  contentProps?: MenuContentProps,
}

const MenuComponent = ({
  children,
  isOpen,
  initialIsOpen = false,
  onIsOpenChange,
  onStateEvent,
  disabled = false,
  trigger,
  triggerProps,
  contentProps,
  contentRef,
}: MenuProps) => {
  const store = useStateStore<MenuState>({
    isOpen: isOpen ?? initialIsOpen,
  })
  const commitBindings = useStateStoreBindings({
    store,
    bindings: {
      isOpen: { value: isOpen, onValueChange: onIsOpenChange },
    },
  })

  return (
    <MenuStateManager
      state={store}
      onStateChange={commitBindings}
      onStateEvent={onStateEvent}
      disabled={disabled}
    >
      <MenuTrigger {...triggerProps}>
        {trigger}
      </MenuTrigger>
      <MenuContent ref={contentRef} {...contentProps}>
        {children}
      </MenuContent>
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
