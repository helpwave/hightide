import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat, useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import type { CalendarDisplayMode } from '../CalendarDatePicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { DateTimePickerContext, type DateTimePickerContextConfig } from './DateTimePickerContext'
import {
  dateTimePickerStateTransition,
  type DateTimePickerEvent,
  type DateTimePickerState
} from './DateTimePickerState'

export type DateTimePickerStateManagerProps = InputStateMangerProps<DateTimePickerState, DateTimePickerEvent> & {
  children?: ReactNode,
  mode?: DateTimeFormat,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
  initialDisplay?: CalendarDisplayMode,
}

export function DateTimePickerStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  mode = 'dateTime',
  start,
  end,
  weekStart,
  markToday,
  is24HourFormat: is24HourFormatOverride,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  initialDisplay,
  children,
}: DateTimePickerStateManagerProps) {
  const { locale } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const config = useMemo<DateTimePickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired }),
    mode,
    start,
    end,
    weekStart,
    markToday,
    is24HourFormat,
    minuteIncrement,
    secondIncrement,
    millisecondIncrement,
    precision,
    initialDisplay,
    locale,
  }), [end, initialDisplay, is24HourFormat, isDisabled, isInvalid, isReadOnly, isRequired, locale, markToday, millisecondIncrement, minuteIncrement, mode, precision, secondIncrement, start, weekStart])
  const contextValue = useDateStateMachine({
    state,
    transition: dateTimePickerStateTransition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <DateTimePickerContext.Provider value={contextValue}>
      {children}
    </DateTimePickerContext.Provider>
  )
}
