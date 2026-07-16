import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

export type PopUpContextType = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  popUpId: string,
  triggerId: string,
  triggerRef: RefObject<HTMLElement> | null,
  setTriggerRef: (ref: RefObject<HTMLElement> | null) => void,
}

export const PopUpContext = createContext<PopUpContextType | null>(null)

export function usePopUpContext() {
  const context = useContext(PopUpContext)
  if (!context) {
    throw new Error('usePopUpContext must be used within a <PopUpContext.Provider>')
  }
  return context
}
