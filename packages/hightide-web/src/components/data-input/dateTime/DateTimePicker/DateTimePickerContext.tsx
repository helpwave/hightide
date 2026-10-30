import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimePickerEvent, DateTimePickerOptions, DateTimePickerState } from './DateTimePickerState'

export interface DateTimePickerContextConfig extends DateTimePickerOptions, DOMInputConfig {}

export type DateTimePickerContextValue = DOMInputContextValue<DateTimePickerState, DateTimePickerEvent, DateTimePickerContextConfig>

export const DateTimePickerContext = createContext<DateTimePickerContextValue | null>(null)

export function useDateTimePickerContext(): DateTimePickerContextValue {
  const context = useContext(DateTimePickerContext)
  if (!context) throw new Error('useDateTimePickerContext must be used inside a DateTimePicker.StateManager')
  return context
}
