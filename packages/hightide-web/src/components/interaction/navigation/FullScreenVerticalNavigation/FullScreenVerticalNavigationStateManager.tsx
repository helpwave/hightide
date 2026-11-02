import type { ElementType, ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import type { NavigationItemData, NavigationLinkComponentProps } from '../types'
import {
  FullScreenVerticalNavigationContext,
  type FullScreenVerticalNavigationContextValue
} from './FullScreenVerticalNavigationContext'
import {
  fullScreenVerticalNavigationStateTransition,
  type FullScreenVerticalNavigationEvent,
  type FullScreenVerticalNavigationState
} from './FullScreenVerticalNavigationState'

export type FullScreenVerticalNavigationStateManagerProps =
  StateManagerProps<FullScreenVerticalNavigationState, FullScreenVerticalNavigationEvent> & {
    children?: ReactNode,
    items?: NavigationItemData[],
    LinkComponent?: ElementType<NavigationLinkComponentProps>,
    activeId?: string | null,
  }

export function FullScreenVerticalNavigationStateManager({
  state,
  onStateChange,
  onStateEvent,
  children,
  items = [],
  LinkComponent,
  activeId = null,
}: FullScreenVerticalNavigationStateManagerProps) {
  const machine = useStateMachine<FullScreenVerticalNavigationState, FullScreenVerticalNavigationEvent>({
    state,
    transition: fullScreenVerticalNavigationStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: FullScreenVerticalNavigationEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const contextValue = useMemo((): FullScreenVerticalNavigationContextValue => ({
    state: machine.state,
    dispatch,
    items,
    LinkComponent,
    activeId,
  }), [activeId, dispatch, items, LinkComponent, machine.state])

  return (
    <FullScreenVerticalNavigationContext.Provider value={contextValue}>
      {children}
    </FullScreenVerticalNavigationContext.Provider>
  )
}
