import type { Dispatch, ElementType, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { NavigationItemData } from '../../interaction/navigation/types'
import type { LinkComponentProps } from '../../interaction/navigation/VerticalNavigationMenu'
import type { AppPageEvent, AppPageState } from './AppPageState'

export type AppPageContextValue = {
  state: AppPageState,
  dispatch: Dispatch<AppPageEvent>,
  items?: NavigationItemData[],
  LinkComponent?: ElementType<LinkComponentProps>,
  activeId?: string | null,
  contentOverwrite?: ReactNode,
  noScrolling: boolean,
  hasSpacer: boolean,
}

export const AppPageContext = createContext<AppPageContextValue | null>(null)

export function useAppPageContext(): AppPageContextValue {
  const context = useContext(AppPageContext)
  if (!context) {
    throw new Error('useAppPageContext must be used inside a AppPage.StateManager')
  }
  return context
}
