import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

export type ModalContextType = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
}

export const ModalContext = createContext<ModalContextType | null>(null)

export function useModalContext(): ModalContextType {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within Modal.Root')
  }
  return context
}
