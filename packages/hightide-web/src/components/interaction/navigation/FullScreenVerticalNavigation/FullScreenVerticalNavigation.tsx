import type { ElementType, ReactNode } from 'react'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
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
  onStateEvent,
  showTrigger = true,
  children,
}: FullScreenVerticalNavigationProps) {
  const store = useStateStore<FullScreenVerticalNavigationState>({
    isOpen: isOpen ?? initialIsOpen,
  })
  const commitBindings = useStateStoreBindings({
    store,
    bindings: {
      isOpen: { value: isOpen, onValueChange: onIsOpenChange },
    },
  })

  return (
    <FullScreenVerticalNavigationStateManager
      state={store}
      onStateChange={commitBindings}
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
