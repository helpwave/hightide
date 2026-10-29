import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { DateTimePickerEvent, DateTimePickerOptions, DateTimePickerState } from './DateTimePickerState'

export interface DateTimePickerContextConfig extends DateTimePickerOptions, InputConfig {}

export type DateTimePickerContextValue = InputContextValue<DateTimePickerState, DateTimePickerEvent, DateTimePickerContextConfig>

export const DateTimePickerContext = createContext<DateTimePickerContextValue | null>(null)

export function useDateTimePickerContext(): DateTimePickerContextValue {
  const context = useContext(DateTimePickerContext)
  if (!context) throw new Error('useDateTimePickerContext must be used inside a DateTimePicker.StateManager')
  return context
}
