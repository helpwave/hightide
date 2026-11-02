import type { ElementType } from 'react'
import { createContext, useContext } from 'react'
import type { NavigationLinkComponentProps } from '../types'

export type HorizontalNavigationBarContextValue = {
  LinkComponent: ElementType<NavigationLinkComponentProps>,
  onClose?: () => void,
  activeId?: string | null,
}

export const HorizontalNavigationBarContext = createContext<HorizontalNavigationBarContextValue | null>(null)

export function useHorizontalNavigationBarContext(): HorizontalNavigationBarContextValue {
  const context = useContext(HorizontalNavigationBarContext)
  if (!context) {
    throw new Error('useHorizontalNavigationBarContext must be used inside a HorizontalNavigationBar.StateManager')
  }
  return context
}
