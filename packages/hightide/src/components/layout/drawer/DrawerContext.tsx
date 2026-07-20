import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

export type DrawerContextType = {
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export const DrawerContext = createContext<DrawerContextType | null>(null)

export function useDrawerContext() {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawerContext must be used within a <DrawerRoot>')
  }
  return context
}


