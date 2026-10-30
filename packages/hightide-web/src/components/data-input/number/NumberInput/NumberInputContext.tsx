import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { NumberInputEvent, NumberInputState } from './NumberInputState'

export type NumberInputContextValue = DOMInputContextValue<NumberInputState, NumberInputEvent, DOMInputConfig>

export const NumberInputContext = createContext<NumberInputContextValue | null>(null)

export function useNumberInputContext(): NumberInputContextValue {
  const context = useContext(NumberInputContext)
  if (!context) throw new Error('useNumberInputContext must be used inside a NumberInput.StateManager')
  return context
}
