import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { DateTimeFieldEvent, DateTimeFieldState } from './DateTimeFieldState'

export type DateTimeFieldContextValue = InputContextValue<DateTimeFieldState, DateTimeFieldEvent, InputConfig> & {
  locale: string,
  is24HourFormat: boolean,
}

export const DateTimeFieldContext = createContext<DateTimeFieldContextValue | null>(null)

export function useDateTimeFieldContext(): DateTimeFieldContextValue {
  const context = useContext(DateTimeFieldContext)
  if (!context) throw new Error('useDateTimeFieldContext must be used inside a DateTimeField.StateManager')
  return context
}
