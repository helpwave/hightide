import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

export type DialogContextType = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  isModal: boolean,
}

export const DialogContext = createContext<DialogContextType | null>(null)

export function useDialogContext() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialogContext must be used within a <DialogContext.Provider>')
  }
  return context
}