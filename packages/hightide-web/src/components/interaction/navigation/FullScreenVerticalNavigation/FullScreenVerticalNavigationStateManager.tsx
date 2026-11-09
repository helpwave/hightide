import type { ElementType, ReactNode } from 'react'
import { useMemo } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
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
  initialState,
  onStateChange,
  onStateEvent,
  children,
  items = [],
  LinkComponent,
  activeId = null,
}: FullScreenVerticalNavigationStateManagerProps) {
  const machine = useStateMachineController<FullScreenVerticalNavigationState, FullScreenVerticalNavigationEvent>(state
    ? {
      state,
      transition: fullScreenVerticalNavigationStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
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
