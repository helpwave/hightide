'use client'

import type { HTMLAttributes, SetStateAction } from 'react'
import { useCallback, useContext, useId, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useEventCallbackStabilizer, useLogOnce, useOverlayRegistry } from '@helpwave/hightide-utils/hooks'

import { useFocusTrap } from '../../../hooks/focus/useFocusTrap'
import { usePresenceRef } from '../../../hooks/usePresenceRef'
import { useTransitionState } from '../../../hooks/useTransitionState'
import { Portal } from '../Portal'
import { Visibility } from '../Visibility'
import { PropsUtil } from '../../../utils/propsUtil'
import { ModalContext } from './ModalContext'
import type { ModalIds } from './ModalContext'

export type ModalContainerProps = HTMLAttributes<HTMLDivElement> & {
  isOpen?: boolean,
  onClose?: () => void,
  isClosable?: boolean,
  hasDescription?: boolean,
  contentId?: string,
}

export function ModalContainer({
  children,
  isOpen: isOpenProp,
  onClose,
  isClosable: isClosableProp,
  hasDescription = false,
  contentId,
  ...props
}: ModalContainerProps) {
  const parent = useContext(ModalContext)
  const generatedId = useId()
  const isOpen = isOpenProp ?? parent?.isOpen ?? false
  const isClosable = isClosableProp ?? parent?.isClosable ?? true
  const parentSetIsOpen = parent?.setIsOpen
  const setIsOpen = useCallback((action: SetStateAction<boolean>) => {
    const next = typeof action === 'function' ? action(isOpen) : action
    if (!isClosable && isOpen && !next) {
      return
    }
    parentSetIsOpen?.(next)
  }, [isClosable, isOpen, parentSetIsOpen])
  const containerRef = useRef<HTMLDivElement>(null)
  const onCloseStable = useEventCallbackStabilizer(onClose)

  const ids = useMemo<ModalIds>(() => ({
    container: `modal-container-${generatedId}`,
    background: `modal-background-${generatedId}`,
    content: contentId ?? `modal-content-${generatedId}`,
    title: `modal-title-${generatedId}`,
    description: `modal-description-${generatedId}`,
  }), [contentId, generatedId])

  const onCloseWrapper = useCallback(() => {
    if (!isClosable) {
      return
    }
    onCloseStable()
    setIsOpen(false)
  }, [isClosable, onCloseStable, setIsOpen])

  useLogOnce('Modal: onClose should be defined when the modal is closable', isClosable && !onClose && !parent)

  const { isVisible, transitionState } = useTransitionState({ isOpen, ref: containerRef })
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({
    isOpen,
  })
  useFocusTrap({
    container: ref,
    active: isVisible,
  })
  const { zIndex } = useOverlayRegistry({
    isActive: isVisible,
  })

  const contextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    isClosable,
    ids,
    onClose: onCloseWrapper,
    transitionState,
    hasDescription,
    contentRef: ref,
    contentRefAssignment: refAssignment,
    isContentPresent: isPresent,
  }), [hasDescription, ids, isClosable, isOpen, isPresent, onCloseWrapper, ref, refAssignment, setIsOpen, transitionState])

  return (
    <ModalContext.Provider value={contextValue}>
      <Visibility isVisible={isVisible}>
        <Portal>
          <div
            {...props}
            ref={containerRef}
            id={ids.container}
            data-open={PropsUtil.dataAttributes.bool(isOpen)}
            data-closable={PropsUtil.dataAttributes.bool(isClosable)}
            className={clsx('modal-container', props.className)}
            style={{ ...props.style, zIndex }}
            onKeyDown={(event) => {
              props.onKeyDown?.(event)
              if (event.key !== 'Escape' || event.defaultPrevented) {
                return
              }
              event.preventDefault()
              onCloseWrapper()
            }}
          >
            {children}
          </div>
        </Portal>
      </Visibility>
    </ModalContext.Provider>
  )
}
