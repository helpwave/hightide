import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type { DateTimeInputEvent, DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputContextValue = InputContextValue<DateTimeInputState, DateTimeInputEvent, InputConfig> & {
  mode: DateTimeFormat,
  precision: DateTimePrecision,
  timeZone: string,
  is24HourFormat: boolean,
  hasClear: boolean,
  hasTimePicker: boolean,
}

export const DateTimeInputContext = createContext<DateTimeInputContextValue | null>(null)

export function useDateTimeInputContext(): DateTimeInputContextValue {
  const context = useContext(DateTimeInputContext)
  if (!context) throw new Error('useDateTimeInputContext must be used inside a DateTimeInput.StateManager')
  return context
}
