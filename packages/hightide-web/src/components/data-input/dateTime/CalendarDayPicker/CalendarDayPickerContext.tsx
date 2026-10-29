import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import type { CalendarDayPickerEvent, CalendarDayPickerState } from './CalendarDayPickerState'

export interface CalendarDayPickerContextConfig extends InputConfig {
  start?: Date,
  end?: Date,
  weekStart: Weekday,
  markToday: boolean,
  locale: string,
}

export type CalendarDayPickerContextValue = InputContextValue<CalendarDayPickerState, CalendarDayPickerEvent, CalendarDayPickerContextConfig>

export const CalendarDayPickerContext = createContext<CalendarDayPickerContextValue | null>(null)

export function useCalendarDayPickerContext(): CalendarDayPickerContextValue {
  const context = useContext(CalendarDayPickerContext)
  if (!context) throw new Error('useCalendarDayPickerContext must be used inside a CalendarDayPicker.StateManager')
  return context
}
