import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { FlexibleDateTimeInputEvent, FlexibleDateTimeInputState } from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputContextValue = InputContextValue<
  FlexibleDateTimeInputState,
  FlexibleDateTimeInputEvent,
  InputConfig
>

export const FlexibleDateTimeInputContext = createContext<FlexibleDateTimeInputContextValue | null>(null)

export function useFlexibleDateTimeInputContext(): FlexibleDateTimeInputContextValue {
  const context = useContext(FlexibleDateTimeInputContext)
  if (!context) throw new Error('useFlexibleDateTimeInputContext must be used inside a FlexibleDateTimeInput.StateManager')
  return context
}
