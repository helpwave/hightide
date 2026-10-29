import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { ToggleableInputEvent, ToggleableInputState } from './ToggleableInputState'

export type ToggleableInputContextValue = InputContextValue<ToggleableInputState, ToggleableInputEvent, InputConfig>

export const ToggleableInputContext = createContext<ToggleableInputContextValue | null>(null)

export function useToggleableInputContext(): ToggleableInputContextValue {
  const context = useContext(ToggleableInputContext)
  if (!context) throw new Error('useToggleableInputContext must be used inside a ToggleableInput.StateManager')
  return context
}
