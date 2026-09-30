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
import { ModalContent } from './ModalContent'
import type { ModalContentProps, ModalPosition } from './ModalContent'
import { ModalContext } from './ModalContext'
import { ModalDescription } from './ModalDescription'
import type { ModalDescriptionProps } from './ModalDescription'
import { ModalOpener } from './ModalOpener'
import { ModalRoot } from './ModalRoot'
import { ModalTitle } from './ModalTitle'
import type { ModalTitleProps } from './ModalTitle'

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
      contentId={contentProps?.id}
      className={clsx(containerProps?.className)}
    >
      <ModalBackground {...backgroundProps} />
      <ModalContent
        {...contentProps}
        ref={forwardedRef}
        position={position}
        className={clsx(contentProps?.className)}
      >
        <ModalTitle {...titleProps}>
          {titleElement}
        </ModalTitle>
        <ModalDescription {...descriptionProps}>
          {description}
        </ModalDescription>
        <ModalCloseButton {...closeButtonProps} />
        {children}
      </ModalContent>
    </ModalContainer>
  )
})

const Modal = Object.assign(ModalComponent, {
  Root: ModalRoot,
  Container: ModalContainer,
  Background: ModalBackground,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseButton: ModalCloseButton,
  Opener: ModalOpener,
  Context: ModalContext,
  Consumer: ModalContext.Consumer,
})

export { Modal }
