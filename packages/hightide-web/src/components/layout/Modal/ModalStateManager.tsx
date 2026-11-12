'use client'

import { useCallback, useId, useMemo, useRef } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useOverlayRegistry, useStateManager } from '@helpwave/hightide-utils/hooks'

import { useFocusTrap } from '../../../hooks/focus/useFocusTrap'
import { useTransitionState } from '../../../hooks/useTransitionState'
import type { ModalContextType, ModalIds } from './ModalContext'
import { ModalContext } from './ModalContext'
import { modalStateTransition, type ModalEvent, type ModalState } from './ModalState'

export type ModalStateManagerProps = StateManagerProps<ModalState, ModalEvent> & {
  hasDescription?: boolean,
  ids?: Partial<ModalIds>,
}

export function ModalStateManager({
  state,
  onStateChange,
  onStateEvent,
  hasDescription = false,
  ids,
  children,
}: ModalStateManagerProps) {
  const machine = useStateManager({
    state,
    initialState: { isOpen: false },
    transition: modalStateTransition,
    onStateChange,
    onStateEvent,
  })
  const { dispatch, state: modalState } = machine
  const generatedId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    dispatch({ type: 'close' })
  }, [dispatch])
  const modalIds = useMemo<ModalIds>(() => ({
    container: ids?.container ?? `modal-container-${generatedId}`,
    background: ids?.background ?? `modal-background-${generatedId}`,
    content: ids?.content ?? `modal-content-${generatedId}`,
    title: ids?.title ?? `modal-title-${generatedId}`,
    description: ids?.description ?? `modal-description-${generatedId}`,
  }), [generatedId, ids])
  const { isVisible, transitionState } = useTransitionState({
    isOpen: modalState.isOpen,
    ref: containerRef,
  })
  useFocusTrap({
    container: contentRef,
    active: isVisible,
  })
  const { zIndex } = useOverlayRegistry({
    isActive: isVisible,
  })

  const contextValue = useMemo<ModalContextType>(() => ({
    state: modalState,
    dispatch,
    close,
    ids: modalIds,
    transitionState,
    hasDescription,
    contentRef,
    containerRef,
    zIndex,
  }), [close, containerRef, contentRef, dispatch, hasDescription, modalIds, modalState, transitionState, zIndex])

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}
