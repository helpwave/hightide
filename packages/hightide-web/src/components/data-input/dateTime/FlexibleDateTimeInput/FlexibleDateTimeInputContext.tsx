import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { FlexibleDateTimeInputEvent, FlexibleDateTimeInputState } from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputContextValue = DOMInputContextValue<
  FlexibleDateTimeInputState,
  FlexibleDateTimeInputEvent,
  DOMInputConfig
>

export const FlexibleDateTimeInputContext = createContext<FlexibleDateTimeInputContextValue | null>(null)

export function useFlexibleDateTimeInputContext(): FlexibleDateTimeInputContextValue {
  const context = useContext(FlexibleDateTimeInputContext)
  if (!context) throw new Error('useFlexibleDateTimeInputContext must be used inside a FlexibleDateTimeInput.StateManager')
  return context
}
