import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { InsideLabelInputEvent, InsideLabelInputState } from './InsideLabelInputState'

export type InsideLabelInputContextValue = DOMInputContextValue<InsideLabelInputState, InsideLabelInputEvent, DOMInputConfig>

export const InsideLabelInputContext = createContext<InsideLabelInputContextValue | null>(null)

export function useInsideLabelInputContext(): InsideLabelInputContextValue {
  const context = useContext(InsideLabelInputContext)
  if (!context) throw new Error('useInsideLabelInputContext must be used inside an InsideLabelInput.StateManager')
  return context
}
