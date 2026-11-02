import type { ElementType, ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import type { NavigationItemData } from '../../../interaction/navigation/types'
import type { LinkComponentProps } from '../../../interaction/navigation/VerticalNavigationMenu'
import { AppPageContext, type AppPageContextValue } from './AppPageContext'
import {
  appPageStateTransition,
  type AppPageEvent,
  type AppPageState
} from './AppPageState'

export type AppPageStateManagerProps = StateManagerProps<AppPageState, AppPageEvent> & {
  children?: ReactNode,
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
  const machine = useStateMachine<AppPageState, AppPageEvent>({
    state,
    transition: appPageStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: AppPageEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const contextValue = useMemo((): AppPageContextValue => ({
    state: machine.state,
    dispatch,
    items,
    LinkComponent,
    activeId,
    contentOverwrite,
    noScrolling,
    hasSpacer,
  }), [activeId, contentOverwrite, dispatch, hasSpacer, items, LinkComponent, machine.state, noScrolling])

  return (
    <AppPageContext.Provider value={contextValue}>
      {children}
    </AppPageContext.Provider>
  )
}
