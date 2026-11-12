'use client'

import type { ReactNode, Ref } from 'react'
import clsx from 'clsx'
import { useStateStore, useStateStoreBindings, type StateStoreBindingChange } from '@helpwave/hightide-utils/hooks'

import { ModalBackground } from './ModalBackground'
import type { ModalBackgroundProps } from './ModalBackground'
import { ModalCloseButton } from './ModalCloseButton'
import type { ModalCloseButtonProps } from './ModalCloseButton'
import { ModalContainer } from './ModalContainer'
import type { ModalContainerProps } from './ModalContainer'
import { ModalPanel, type ModalPanelProps, type ModalPosition } from './ModalPanel'
import { ModalContext, type ModalIds } from './ModalContext'
import { ModalDescription } from './ModalDescription'
import type { ModalDescriptionProps } from './ModalDescription'
import { ModalOpener, type ModalOpenerProps } from './ModalOpener'
import { ModalTitle } from './ModalTitle'
import type { ModalTitleProps } from './ModalTitle'
import { ModalContent, type ModalContentProps } from './ModalContent'
import { ModalStateManager } from './ModalStateManager'
import { type ModalEvent, type ModalState } from './ModalState'

export type { ModalPosition }

export type ModalProps = {
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void | StateStoreBindingChange<boolean>,
  onStateEvent?: (event: ModalEvent) => void,
  titleElement: ReactNode,
  description: ReactNode,
  position?: ModalPosition,
  trigger?: ModalOpenerProps['children'],
  children?: ReactNode,
  containerRef?: Ref<HTMLDivElement>,
  backgroundRef?: Ref<HTMLDivElement>,
  panelRef?: Ref<HTMLDivElement>,
  contentRef?: Ref<HTMLDivElement>,
  titleRef?: Ref<HTMLDivElement>,
  descriptionRef?: Ref<HTMLDivElement>,
  closeButtonRef?: Ref<HTMLButtonElement>,
  containerProps?: ModalContainerProps,
  backgroundProps?: ModalBackgroundProps,
  panelProps?: ModalPanelProps,
  contentProps?: ModalContentProps,
  titleProps?: ModalTitleProps,
  descriptionProps?: ModalDescriptionProps,
  closeButtonProps?: ModalCloseButtonProps,
  ids?: Partial<ModalIds>,
}

function ModalComponent({
  children,
  isOpen,
  onIsOpenChange,
  onStateEvent,
  titleElement,
  description,
  position = 'center',
  trigger,
  containerRef,
  backgroundRef,
  panelRef,
  contentRef,
  titleRef,
  descriptionRef,
  closeButtonRef,
  containerProps,
  backgroundProps,
  panelProps,
  contentProps,
  titleProps,
  descriptionProps,
  closeButtonProps,
  ids,
}: ModalProps) {
  const store = useStateStore<ModalState>({
    isOpen: isOpen ?? false,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      isOpen: {
        value: isOpen,
        onValueChange: onIsOpenChange,
      },
    },
  })

  return (
    <ModalStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      hasDescription={!!description}
      ids={ids}
    >
      {trigger && (
        <ModalOpener>
          {trigger}
        </ModalOpener>
      )}
      <ModalContainer
        {...containerProps}
        ref={containerRef}
        className={clsx(containerProps?.className)}
      >
        {containerProps?.children ?? (
          <>
            <ModalBackground
              {...backgroundProps}
              ref={backgroundRef}
            />
            <ModalPanel
              {...panelProps}
              ref={panelRef}
              position={panelProps?.position ?? position}
              className={clsx(panelProps?.className)}
            >
              <ModalTitle
                {...titleProps}
                ref={titleRef}
              >
                {titleElement}
              </ModalTitle>
              <ModalContent
                {...contentProps}
                ref={contentRef}
              >
                <ModalDescription
                  {...descriptionProps}
                  ref={descriptionRef}
                >
                  {description}
                </ModalDescription>
                <ModalCloseButton
                  {...closeButtonProps}
                  ref={closeButtonRef}
                />
                {children}
              </ModalContent>
            </ModalPanel>
          </>
        )}
      </ModalContainer>
    </ModalStateManager>
  )
}

const Modal = Object.assign(ModalComponent, {
  StateManager: ModalStateManager,
  Container: ModalContainer,
  Background: ModalBackground,
  Content: ModalPanel,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseButton: ModalCloseButton,
  Opener: ModalOpener,
  Context: ModalContext,
  Provider: ModalContext.Provider,
  Consumer: ModalContext.Consumer,
})

export { Modal }
