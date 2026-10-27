import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import type { CalendarDatePickerEvent, CalendarDatePickerState } from './CalendarDatePickerState'

export interface CalendarDatePickerContextConfig extends InputConfig {
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday: boolean,
  locale: string,
}

export type CalendarDatePickerContextValue = InputContextValue<CalendarDatePickerState, CalendarDatePickerEvent, CalendarDatePickerContextConfig>

export const CalendarDatePickerContext = createContext<CalendarDatePickerContextValue | null>(null)

export function useCalendarDatePickerContext(): CalendarDatePickerContextValue {
  const context = useContext(CalendarDatePickerContext)
  if (!context) throw new Error('useCalendarDatePickerContext must be used inside a CalendarDatePicker.StateManager')
  return context
}
