import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { InsideLabelInputEvent, InsideLabelInputState } from './InsideLabelInputState'

export type InsideLabelInputContextValue = InputContextValue<InsideLabelInputState, InsideLabelInputEvent, InputConfig>

export const InsideLabelInputContext = createContext<InsideLabelInputContextValue | null>(null)

export function useInsideLabelInputContext(): InsideLabelInputContextValue {
  const context = useContext(InsideLabelInputContext)
  if (!context) throw new Error('useInsideLabelInputContext must be used inside an InsideLabelInput.StateManager')
  return context
}
