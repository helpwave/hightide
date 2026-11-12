import { createContext, useContext } from 'react'
import type { DirectionNumber } from '@helpwave/hightide-utils/utils'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { NumberStepperInputEvent, NumberStepperInputState } from './NumberStepperInputState'

export type NumberStepperInputScrollInputMethod = 'button' | 'keyboard'

export type NumberStepperInputContextValue = DOMInputContextValue<NumberStepperInputState, NumberStepperInputEvent, DOMInputConfig> & {
  startScroll: (inputType: NumberStepperInputScrollInputMethod, direction: DirectionNumber) => void,
  stopScroll: (inputType: NumberStepperInputScrollInputMethod, direction: DirectionNumber) => void,
}

export const NumberStepperInputContext = createContext<NumberStepperInputContextValue | null>(null)

export function useNumberStepperInputContext(): NumberStepperInputContextValue {
  const context = useContext(NumberStepperInputContext)
  if (!context) throw new Error('useNumberStepperInputContext must be used inside a NumberStepperInput.StateManager')
  return context
}
