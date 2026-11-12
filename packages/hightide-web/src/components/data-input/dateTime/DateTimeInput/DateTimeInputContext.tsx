import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type { DateTimeInputEvent, DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputIds = {
  popup: string,
  label: string,
}

export type DateTimeInputContextValue = DOMInputContextValue<DateTimeInputState, DateTimeInputEvent, DOMInputConfig> & {
  mode: DateTimeFormat,
  precision: DateTimePrecision,
  timeZone: string | undefined,
  is24HourFormat: boolean,
  hasClear: boolean,
  hasTimePicker: boolean,
  ids: DateTimeInputIds,
  anchorRef: RefObject<HTMLDivElement | null>,
}

export const DateTimeInputContext = createContext<DateTimeInputContextValue | null>(null)

export function useDateTimeInputContext(): DateTimeInputContextValue {
  const context = useContext(DateTimeInputContext)
  if (!context) throw new Error('useDateTimeInputContext must be used inside a DateTimeInput.StateManager')
  return context
}
