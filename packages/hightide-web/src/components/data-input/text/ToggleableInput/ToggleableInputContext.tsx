import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { ToggleableInputEvent, ToggleableInputState } from './ToggleableInputState'

export type ToggleableInputContextValue = DOMInputContextValue<ToggleableInputState, ToggleableInputEvent, DOMInputConfig>

export const ToggleableInputContext = createContext<ToggleableInputContextValue | null>(null)

export function useToggleableInputContext(): ToggleableInputContextValue {
  const context = useContext(ToggleableInputContext)
  if (!context) throw new Error('useToggleableInputContext must be used inside a ToggleableInput.StateManager')
  return context
}
