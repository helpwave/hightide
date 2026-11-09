import type { ElementType } from 'react'
import { useMemo } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
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
  const machine = useStateMachine({
    state,
    transition: fullScreenVerticalNavigationStateTransition,
    onStateChange,
    onStateEvent,
  })

  const contextValue = useMemo((): FullScreenVerticalNavigationContextValue => ({
    state: machine.state,
    dispatch: machine.dispatch,
    items,
    LinkComponent,
    activeId,
  }), [activeId, machine.dispatch, items, LinkComponent, machine.state])

  return (
    <FullScreenVerticalNavigationContext.Provider value={contextValue}>
      {children}
    </FullScreenVerticalNavigationContext.Provider>
  )
}
