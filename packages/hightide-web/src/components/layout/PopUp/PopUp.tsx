import type { ReactNode, Ref } from 'react'
import { useStateStore, useStateStoreBindings, type StateStoreBindingChange } from '@helpwave/hightide-utils/hooks'
import { PopUpPanel, type PopUpPanelProps } from './PopUpPanel'
import { PopUpContext } from './PopUpContext'
import { PopUpOpener, type PopUpOpenerProps } from './PopUpOpener'
import { type PopUpEvent, type PopUpState } from './PopUpState'
import { PopUpStateManager } from './PopUpStateManager'

export type { PopUpPanelProps }

export type PopUpProps = {
  children?: ReactNode,
  isOpen?: boolean,
  initialIsOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void | StateStoreBindingChange<boolean>,
  onStateEvent?: (event: PopUpEvent) => void,
  trigger?: PopUpOpenerProps<HTMLButtonElement>['children'],
  panelRef?: Ref<HTMLDivElement>,
  panelProps?: Omit<PopUpPanelProps, 'children' | 'panelRef'>,
}

const PopUpComponent = ({
  children,
  isOpen,
  initialIsOpen = false,
  onIsOpenChange,
  onStateEvent,
  trigger,
  panelRef,
  panelProps,
}: PopUpProps) => {
  const store = useStateStore<PopUpState>({
    isOpen: isOpen ?? initialIsOpen,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      isOpen: {
        value: isOpen,
        onValueChange: (next) => onIsOpenChange?.(next),
      },
    },
  })

  return (
    <PopUpStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
    >
      {trigger && (
        <PopUpOpener<HTMLButtonElement>>
          {trigger}
        </PopUpOpener>
      )}
      <PopUpPanel {...panelProps} panelRef={panelRef}>
        {children}
      </PopUpPanel>
    </PopUpStateManager>
  )
}

export const PopUp = Object.assign(PopUpComponent, {
  StateManager: PopUpStateManager,
  Opener: PopUpOpener,
  Panel: PopUpPanel,
  Context: PopUpContext,
  Provider: PopUpContext.Provider,
  Consumer: PopUpContext.Consumer,
})
