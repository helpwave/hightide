import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type { TimeWheelPickerEvent, TimeWheelPickerState, WheelLoopingBehaviour } from './TimeWheelPickerState'

export interface TimeWheelPickerContextConfig extends DOMInputConfig {
  is24HourFormat: boolean,
  isLooping: boolean,
  loopingBehaviour: WheelLoopingBehaviour,
  precision: DateTimePrecision,
  hours: number[],
  minutes: number[],
  seconds: number[],
  milliseconds: number[],
}

export type TimeWheelPickerContextValue = DOMInputContextValue<TimeWheelPickerState, TimeWheelPickerEvent, TimeWheelPickerContextConfig>

export const TimeWheelPickerContext = createContext<TimeWheelPickerContextValue | null>(null)

export function useTimeWheelPickerContext(): TimeWheelPickerContextValue {
  const context = useContext(TimeWheelPickerContext)
  if (!context) throw new Error('useTimeWheelPickerContext must be used inside a TimeWheelPicker.StateManager')
  return context
}
