import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { PopUpEvent, PopUpState } from './PopUpState'

export type PopUpContextType = {
  state: PopUpState,
  dispatch: (event: PopUpEvent) => void,
  popUpId: string,
  triggerId: string,
  triggerRef: RefObject<HTMLElement | null>,
}

export const PopUpContext = createContext<PopUpContextType | null>(null)

export function usePopUpContext() {
  const context = useContext(PopUpContext)
  if (!context) {
    throw new Error('usePopUpContext must be used within a PopUp.StateManager')
  }
  return context
}
