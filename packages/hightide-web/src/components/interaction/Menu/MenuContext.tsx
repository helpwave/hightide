import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { MenuEvent, MenuState } from './MenuState'

export type MenuContextValue = {
  state: MenuState,
  dispatch: (event: MenuEvent) => void,
  disabled: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  setTriggerRef: (ref: RefObject<HTMLElement | null> | null) => void,
}

export const MenuContext = createContext<MenuContextValue | null>(null)

export function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenuContext must be used inside a Menu.StateManager')
  }
  return context
}
