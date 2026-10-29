import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { NumberInputEvent, NumberInputState } from './NumberInputState'

export type NumberInputContextValue = InputContextValue<NumberInputState, NumberInputEvent, InputConfig>

export const NumberInputContext = createContext<NumberInputContextValue | null>(null)

export function useNumberInputContext(): NumberInputContextValue {
  const context = useContext(NumberInputContext)
  if (!context) throw new Error('useNumberInputContext must be used inside a NumberInput.StateManager')
  return context
}
