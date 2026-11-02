import type { Dispatch, ElementType } from 'react'
import { createContext, useContext } from 'react'
import type { NavigationItemData, NavigationLinkComponentProps } from '../types'
import type { FullScreenVerticalNavigationEvent, FullScreenVerticalNavigationState } from './FullScreenVerticalNavigationState'

export type FullScreenVerticalNavigationContextValue = {
  state: FullScreenVerticalNavigationState,
  dispatch: Dispatch<FullScreenVerticalNavigationEvent>,
  items: NavigationItemData[],
  LinkComponent?: ElementType<NavigationLinkComponentProps>,
  activeId?: string | null,
}

export const FullScreenVerticalNavigationContext = createContext<FullScreenVerticalNavigationContextValue | null>(null)

export function useFullScreenVerticalNavigationContext(): FullScreenVerticalNavigationContextValue {
  const context = useContext(FullScreenVerticalNavigationContext)
  if (!context) {
    throw new Error('useFullScreenVerticalNavigationContext must be used inside a FullScreenVerticalNavigation.StateManager')
  }
  return context
}
