import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { YearMonthPickerEvent, YearMonthPickerState } from './YearMonthPickerState'

export interface YearMonthPickerContextConfig extends DOMInputConfig {
  monthNames: string[],
  months: number[],
  years: number[],
}

export type YearMonthPickerContextValue = DOMInputContextValue<YearMonthPickerState, YearMonthPickerEvent, YearMonthPickerContextConfig>

export const YearMonthPickerContext = createContext<YearMonthPickerContextValue | null>(null)

export function useYearMonthPickerContext(): YearMonthPickerContextValue {
  const context = useContext(YearMonthPickerContext)
  if (!context) throw new Error('useYearMonthPickerContext must be used inside a YearMonthPicker.StateManager')
  return context
}
