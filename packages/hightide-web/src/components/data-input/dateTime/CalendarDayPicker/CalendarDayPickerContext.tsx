import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import type { CalendarDayPickerEvent, CalendarDayPickerState } from './CalendarDayPickerState'

export interface CalendarDayPickerContextConfig extends DOMInputConfig {
  start?: Date,
  end?: Date,
  weekStart: Weekday,
  markToday: boolean,
  locale: string,
}

export type CalendarDayPickerContextValue = DOMInputContextValue<CalendarDayPickerState, CalendarDayPickerEvent, CalendarDayPickerContextConfig>

export const CalendarDayPickerContext = createContext<CalendarDayPickerContextValue | null>(null)

export function useCalendarDayPickerContext(): CalendarDayPickerContextValue {
  const context = useContext(CalendarDayPickerContext)
  if (!context) throw new Error('useCalendarDayPickerContext must be used inside a CalendarDayPicker.StateManager')
  return context
}
