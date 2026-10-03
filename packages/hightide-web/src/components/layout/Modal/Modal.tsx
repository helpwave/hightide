'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

import { ModalBackground } from './ModalBackground'
import type { ModalBackgroundProps } from './ModalBackground'
import { ModalCloseButton } from './ModalCloseButton'
import type { ModalCloseButtonProps } from './ModalCloseButton'
import { ModalContainer } from './ModalContainer'
import type { ModalContainerProps } from './ModalContainer'
import { ModalPanel, type ModalPanelProps, type ModalPosition } from './ModalPanel'
import { ModalContext } from './ModalContext'
import { ModalDescription } from './ModalDescription'
import type { ModalDescriptionProps } from './ModalDescription'
import { ModalOpener } from './ModalOpener'
import { ModalRoot } from './ModalRoot'
import { ModalTitle } from './ModalTitle'
import type { ModalTitleProps } from './ModalTitle'
import { ModalContent, type ModalContentProps } from './ModalContent'

export type { ModalPosition }

export type ModalProps = {
  isOpen?: boolean,
  titleElement: ReactNode,
  description: ReactNode,
  onClose?: () => void,
  position?: ModalPosition,
  isClosable?: boolean,
  children?: ReactNode,
  containerProps?: Omit<ModalContainerProps, 'children' | 'isOpen' | 'onClose' | 'isClosable' | 'hasDescription' | 'contentId'>,
  backgroundProps?: ModalBackgroundProps,
  panelProps?: Omit<ModalPanelProps, 'children'>,
  contentProps?: Omit<ModalContentProps, 'children'>,
  titleProps?: Omit<ModalTitleProps, 'children'>,
  descriptionProps?: Omit<ModalDescriptionProps, 'children'>,
  closeButtonProps?: ModalCloseButtonProps,
}

const ModalComponent = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  children,
  isOpen,
  titleElement,
  description,
  onClose,
  position = 'center',
  isClosable = true,
  containerProps,
  backgroundProps,
  panelProps,
  contentProps,
  titleProps,
  descriptionProps,
  closeButtonProps,
}, forwardedRef: ForwardedRef<HTMLDivElement>) {
  return (
    <ModalContainer
      {...containerProps}
      isOpen={isOpen}
      onClose={onClose}
      isClosable={isClosable}
      hasDescription={!!description}
      contentId={panelProps?.id}
      className={clsx(containerProps?.className)}
    >
      <ModalBackground {...backgroundProps} />
      <ModalPanel
        {...panelProps}
        ref={forwardedRef}
        position={position}
        className={clsx(panelProps?.className)}
      >
        <ModalTitle {...titleProps}>
          {titleElement}
        </ModalTitle>
        <ModalContent {...contentProps}>
          <ModalDescription {...descriptionProps}>
            {description}
          </ModalDescription>
          <ModalCloseButton {...closeButtonProps} />
          {children}
        </ModalContent>
      </ModalPanel>
    </ModalContainer>
  )
})

const Modal = Object.assign(ModalComponent, {
  Root: ModalRoot,
  Container: ModalContainer,
  Background: ModalBackground,
  Content: ModalPanel,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseButton: ModalCloseButton,
  Opener: ModalOpener,
  Context: ModalContext,
  Consumer: ModalContext.Consumer,
})

export { Modal }
