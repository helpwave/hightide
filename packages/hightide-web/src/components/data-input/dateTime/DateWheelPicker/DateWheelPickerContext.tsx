import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import type { DateWheelPickerEvent, DateWheelPickerState } from './DateWheelPickerState'

export interface DateWheelPickerContextConfig extends DOMInputConfig {
  isLooping: boolean,
  loopingBehaviour: WheelLoopingBehaviour,
  monthNames: string[],
  months: number[],
  years: number[],
  days: number[],
}

export type DateWheelPickerContextValue = DOMInputContextValue<DateWheelPickerState, DateWheelPickerEvent, DateWheelPickerContextConfig>

export const DateWheelPickerContext = createContext<DateWheelPickerContextValue | null>(null)

export function useDateWheelPickerContext(): DateWheelPickerContextValue {
  const context = useContext(DateWheelPickerContext)
  if (!context) throw new Error('useDateWheelPickerContext must be used inside a DateWheelPicker.StateManager')
  return context
}
