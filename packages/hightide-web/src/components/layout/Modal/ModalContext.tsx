import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { TransitionState } from '../../../hooks/useTransitionState'
import type { ModalEvent, ModalState } from './ModalState'

export type ModalIds = {
  container: string,
  background: string,
  content: string,
  title: string,
  description: string,
}

export type ModalContextType = {
  state: ModalState,
  dispatch: (event: ModalEvent) => void,
  close: () => void,
  ids: ModalIds,
  transitionState: TransitionState,
  hasDescription: boolean,
  contentRef: RefObject<HTMLDivElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  zIndex: number | undefined,
}

export const ModalContext = createContext<ModalContextType | null>(null)

export function useModalContext() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal components must be used within a Modal.StateManager')
  }
  return context
}
