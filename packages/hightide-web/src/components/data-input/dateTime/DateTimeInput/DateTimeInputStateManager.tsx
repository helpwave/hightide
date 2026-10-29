import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { DateTimeInputContext, type DateTimeInputContextValue } from './DateTimeInputContext'
import { dateTimeInputStateTransition, type DateTimeInputEvent, type DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputStateManagerProps = InputStateMangerProps<DateTimeInputState, DateTimeInputEvent> & {
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
  children,
}: DateTimeInputStateManagerProps) {
  const machine = useStateMachine<DateTimeInputState, DateTimeInputEvent>({
    state,
    transition: dateTimeInputStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: DateTimeInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
  const contextValue = useMemo<DateTimeInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
    mode,
    precision,
    timeZone,
    is24HourFormat,
    hasClear,
    hasTimePicker,
  }), [config, dispatch, hasClear, hasTimePicker, is24HourFormat, machine.state, mode, precision, timeZone])

  return (
    <DateTimeInputContext.Provider value={contextValue}>
      {children}
    </DateTimeInputContext.Provider>
  )
}
