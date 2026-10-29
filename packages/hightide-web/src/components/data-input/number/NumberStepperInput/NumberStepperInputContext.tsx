import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { NumberStepperInputEvent, NumberStepperInputState } from './NumberStepperInputState'

export type NumberStepperInputContextValue = InputContextValue<NumberStepperInputState, NumberStepperInputEvent, InputConfig>

export const NumberStepperInputContext = createContext<NumberStepperInputContextValue | null>(null)

export function useNumberStepperInputContext(): NumberStepperInputContextValue {
  const context = useContext(NumberStepperInputContext)
  if (!context) throw new Error('useNumberStepperInputContext must be used inside a NumberStepperInput.StateManager')
  return context
}
