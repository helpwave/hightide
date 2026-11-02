import type { ElementType, ReactNode } from 'react'
import { useCallback } from 'react'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { NavigationItemData, NavigationLinkComponentProps } from '../types'
import { FullScreenVerticalNavigationCloseButton } from './FullScreenVerticalNavigationCloseButton'
import { FullScreenVerticalNavigationContext } from './FullScreenVerticalNavigationContext'
import { FullScreenVerticalNavigationPanel } from './FullScreenVerticalNavigationPanel'
import {
  type FullScreenVerticalNavigationEvent,
  type FullScreenVerticalNavigationState
} from './FullScreenVerticalNavigationState'
import { FullScreenVerticalNavigationStateManager } from './FullScreenVerticalNavigationStateManager'
import { FullScreenVerticalNavigationTrigger } from './FullScreenVerticalNavigationTrigger'

export type FullScreenVerticalNavigationProps = {
  items: NavigationItemData[],
  LinkComponent?: ElementType<NavigationLinkComponentProps>,
  activeId?: string | null,
  isOpen?: boolean,
  initialIsOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  onStateChange?: (state: FullScreenVerticalNavigationState) => void,
  onStateEvent?: (event: FullScreenVerticalNavigationEvent) => void,
  showTrigger?: boolean,
  children?: ReactNode,
}

function FullScreenVerticalNavigationComponent({
  items,
  LinkComponent,
  activeId,
  isOpen,
  initialIsOpen = false,
  onIsOpenChange,
  onStateChange,
  onStateEvent,
  showTrigger = true,
  children,
}: FullScreenVerticalNavigationProps) {
  const [state, setState] = useControlledState<FullScreenVerticalNavigationState>({
    defaultValue: { isOpen: initialIsOpen },
    onValueChange: onStateChange,
  })
  const binding = useStateMachineBinding<FullScreenVerticalNavigationState, boolean>({
    state,
    onStateChange: setState,
    onValueChange: onIsOpenChange,
    value: isOpen,
    inject: useCallback((next: boolean) => ({ isOpen: next }), []),
    get: useCallback((current: FullScreenVerticalNavigationState) => current.isOpen, []),
  })

  return (
    <FullScreenVerticalNavigationStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      items={items}
      LinkComponent={LinkComponent}
      activeId={activeId}
    >
      {children ?? (
        <>
          {showTrigger && <FullScreenVerticalNavigationTrigger />}
          <FullScreenVerticalNavigationPanel />
        </>
      )}
    </FullScreenVerticalNavigationStateManager>
  )
}

export const FullScreenVerticalNavigation = Object.assign(FullScreenVerticalNavigationComponent, {
  StateManager: FullScreenVerticalNavigationStateManager,
  Trigger: FullScreenVerticalNavigationTrigger,
  Panel: FullScreenVerticalNavigationPanel,
  CloseButton: FullScreenVerticalNavigationCloseButton,
  Context: FullScreenVerticalNavigationContext,
  Provider: FullScreenVerticalNavigationContext.Provider,
  Consumer: FullScreenVerticalNavigationContext.Consumer,
})
