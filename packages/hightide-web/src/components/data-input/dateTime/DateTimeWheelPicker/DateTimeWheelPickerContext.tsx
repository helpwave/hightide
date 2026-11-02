import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimeWheelPickerEvent, DateTimeWheelPickerOptions, DateTimeWheelPickerState } from './DateTimeWheelPickerState'

export interface DateTimeWheelPickerContextConfig extends DateTimeWheelPickerOptions, DOMInputConfig {}

export type DateTimeWheelPickerContextValue = DOMInputContextValue<DateTimeWheelPickerState, DateTimeWheelPickerEvent, DateTimeWheelPickerContextConfig>

export const DateTimeWheelPickerContext = createContext<DateTimeWheelPickerContextValue | null>(null)

export function useDateTimeWheelPickerContext(): DateTimeWheelPickerContextValue {
  const context = useContext(DateTimeWheelPickerContext)
  if (!context) throw new Error('useDateTimeWheelPickerContext must be used inside a DateTimeWheelPicker.StateManager')
  return context
}
