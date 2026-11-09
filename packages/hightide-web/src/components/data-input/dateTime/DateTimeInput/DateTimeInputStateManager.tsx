import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { DateTimeInputContext, type DateTimeInputContextValue } from './DateTimeInputContext'
import { dateTimeInputStateTransition, type DateTimeInputEvent, type DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputStateManagerProps = DOMInputStateMangerProps<DateTimeInputState, DateTimeInputEvent> & {
  mode: DateTimeFormat,
  precision: DateTimePrecision,
  timeZone: string,
  is24HourFormat: boolean,
  hasClear: boolean,
  hasTimePicker: boolean,
  children?: ReactNode,
}

export function DateTimeInputStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  mode,
  precision,
  timeZone,
  is24HourFormat,
  hasClear,
  hasTimePicker,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: DateTimeInputStateManagerProps) {
  const machine = useStateMachineController<DateTimeInputState, DateTimeInputEvent>(state
    ? {
      state,
      transition: dateTimeInputStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
      transition: dateTimeInputStateTransition,
      onStateChange,
      onStateEvent,
    })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<DateTimeInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    mode,
    precision,
    timeZone,
    is24HourFormat,
    hasClear,
    hasTimePicker,
  }), [config, hasClear, hasTimePicker, is24HourFormat, machine.dispatch, machine.state, mode, precision, timeZone])

  return (
    <DateTimeInputContext.Provider value={contextValue}>
      {children}
    </DateTimeInputContext.Provider>
  )
}
