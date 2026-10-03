import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import type { TransitionState } from '../../../hooks/useTransitionState'

export type ModalIds = {
  container: string,
  background: string,
  content: string,
  title: string,
  description: string,
}

export type ModalContextType = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  isClosable: boolean,
  ids?: ModalIds,
  onClose?: () => void,
  transitionState?: TransitionState,
  hasDescription?: boolean,
  contentRef?: RefObject<HTMLDivElement | null>,
  contentRefAssignment?: (node: HTMLDivElement | null) => void,
  isContentPresent?: boolean,
}

export const ModalContext = createContext<ModalContextType | null>(null)

export function useModalContext() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal components must be used within a Modal.Root')
  }
  return context
}