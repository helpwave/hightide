import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
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
  const [state, setState] = useControlledState<MenuState>({
    defaultValue: { isOpen: initialIsOpen },
    onValueChange: onStateChange,
  })
  const binding = useStateMachineBinding<MenuState, boolean>({
    state,
    onStateChange: setState,
    value: isOpen,
    inject: useCallback((next: boolean) => ({ isOpen: next }), []),
    get: useCallback((current: MenuState) => current.isOpen, []),
  })

  return (
    <MenuStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
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
