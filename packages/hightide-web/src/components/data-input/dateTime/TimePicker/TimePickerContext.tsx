import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type { TimePickerEvent, TimePickerState } from './TimePickerState'

export interface TimePickerContextConfig extends DOMInputConfig {
  is24HourFormat: boolean,
  precision: DateTimePrecision,
  hours: number[],
  minutes: number[],
  seconds: number[],
  milliseconds: number[],
}

export type TimePickerContextValue = DOMInputContextValue<TimePickerState, TimePickerEvent, TimePickerContextConfig>

export const TimePickerContext = createContext<TimePickerContextValue | null>(null)

export function useTimePickerContext(): TimePickerContextValue {
  const context = useContext(TimePickerContext)
  if (!context) throw new Error('useTimePickerContext must be used inside a TimePicker.StateManager')
  return context
}
