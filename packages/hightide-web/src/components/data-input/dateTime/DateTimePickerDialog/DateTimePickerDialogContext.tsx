import { createContext, useContext } from 'react'
import type { RefObject } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { DateTimePickerDialogEvent, DateTimePickerDialogOptions, DateTimePickerDialogState } from './DateTimePickerDialogState'

export interface DateTimePickerDialogContextConfig extends DateTimePickerDialogOptions, DOMInputConfig {}

export type DateTimePickerDialogContextValue = DOMInputContextValue<DateTimePickerDialogState, DateTimePickerDialogEvent, DateTimePickerDialogContextConfig>

export const DateTimePickerDialogContext = createContext<DateTimePickerDialogContextValue | null>(null)

export function useDateTimePickerDialogContext(): DateTimePickerDialogContextValue {
  const context = useContext(DateTimePickerDialogContext)
  if (!context) throw new Error('useDateTimePickerDialogContext must be used inside a DateTimePickerDialog.StateManager')
  return context
}

export type DateTimePickerDialogChrome = {
  isCompact: boolean,
  isSplit: boolean,
  pairRef: RefObject<HTMLDivElement | null>,
}

export const DateTimePickerDialogChromeContext = createContext<DateTimePickerDialogChrome | null>(null)

export function useDateTimePickerDialogChrome(): DateTimePickerDialogChrome {
  const context = useContext(DateTimePickerDialogChromeContext)
  if (!context) throw new Error('useDateTimePickerDialogChrome must be used inside a DateTimePickerDialog.Layout')
  return context
}
