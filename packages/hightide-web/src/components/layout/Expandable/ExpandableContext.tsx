import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

export type ExpandableContextIdsState = {
  root: string,
  header: string,
  content: string,
}

export type ExpandableContextState = {
  ids: ExpandableContextIdsState,
  setIds: Dispatch<SetStateAction<ExpandableContextIdsState>>,
  disabled: boolean,
  isExpanded: boolean,
  toggle: () => void,
  setIsExpanded: Dispatch<SetStateAction<boolean>>,
}

export const ExpandableContext = createContext<ExpandableContextState | null>(null)

export function useExpandableContext() {
  const context = useContext(ExpandableContext)
  if (!context) {
    throw new Error('Expandable components must be used within an Expandable.Root')
  }
  return context
}

export type ExpandableContextProviderProps = {
  value: ExpandableContextState,
  children: ReactNode,
}

export function ExpandableContextProvider({ value, children }: ExpandableContextProviderProps) {
  return (
    <ExpandableContext.Provider value={value}>
      {children}
    </ExpandableContext.Provider>
  )
}
