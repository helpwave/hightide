import { createContext, useContext } from 'react'
import type { InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { SwitchEvent, SwitchState } from './SwitchState'

export type SwitchContextValue = InputContextValue<SwitchState, SwitchEvent>

export const SwitchContext = createContext<SwitchContextValue | null>(null)

export function useSwitchContext(): SwitchContextValue {
  const context = useContext(SwitchContext)
  if (!context) throw new Error('useSwitchContext must be used inside a Switch.StateManager')
  return context
}
