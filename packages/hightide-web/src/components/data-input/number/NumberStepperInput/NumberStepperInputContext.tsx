import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { NumberStepperInputEvent, NumberStepperInputState } from './NumberStepperInputState'

export type NumberStepperInputContextValue = DOMInputContextValue<NumberStepperInputState, NumberStepperInputEvent, DOMInputConfig>

export const NumberStepperInputContext = createContext<NumberStepperInputContextValue | null>(null)

export function useNumberStepperInputContext(): NumberStepperInputContextValue {
  const context = useContext(NumberStepperInputContext)
  if (!context) throw new Error('useNumberStepperInputContext must be used inside a NumberStepperInput.StateManager')
  return context
}
