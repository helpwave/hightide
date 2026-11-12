import type { ElementType, ReactNode } from 'react'
import { useMemo } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStateManager } from '@helpwave/hightide-utils/hooks'
import type { NavigationItemData } from '../../interaction/navigation/types'
import type { LinkComponentProps } from '../../interaction/navigation/VerticalNavigationMenu'
import { AppPageContext, type AppPageContextValue } from './AppPageContext'
import {
  appPageStateTransition,
  type AppPageEvent,
  type AppPageState
} from './AppPageState'

export type AppPageStateManagerProps = StateManagerProps<AppPageState, AppPageEvent> & {
  items?: NavigationItemData[],
  LinkComponent?: ElementType<LinkComponentProps>,
  activeId?: string | null,
  contentOverwrite?: ReactNode,
  noScrolling?: boolean,
  hasSpacer?: boolean,
}

export function AppPageStateManager({
  state,
  onStateChange,
  onStateEvent,
  children,
  items,
  LinkComponent,
  activeId = null,
  contentOverwrite,
  noScrolling = false,
  hasSpacer = true,
}: AppPageStateManagerProps) {
  const machine = useStateManager({
    state,
    initialState: { isOpen: false },
    transition: appPageStateTransition,
    onStateChange,
    onStateEvent,
  })

  const contextValue = useMemo((): AppPageContextValue => ({
    state: machine.state,
    dispatch: machine.dispatch,
    items,
    LinkComponent,
    activeId,
    contentOverwrite,
    noScrolling,
    hasSpacer,
  }), [activeId, contentOverwrite, machine.dispatch, hasSpacer, items, LinkComponent, machine.state, noScrolling])

  return (
    <AppPageContext.Provider value={contextValue}>
      {children}
    </AppPageContext.Provider>
  )
}
