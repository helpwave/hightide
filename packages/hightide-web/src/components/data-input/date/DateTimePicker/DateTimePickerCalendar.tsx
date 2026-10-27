import type { ComponentRef, ReactNode, Ref } from 'react'
import { useCallback } from 'react'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { CalendarDatePicker, type CalendarDatePickerLayoutProps, type CalendarDatePickerState } from '../CalendarDatePicker'
import { useDateTimePickerContext } from './DateTimePickerContext'

function timeLabelFor(value: Date, locale: string, is24HourFormat: boolean, precision?: DateTimePrecision) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: precision === 'second' || precision === 'millisecond' ? '2-digit' : undefined,
    hourCycle: is24HourFormat ? 'h23' : 'h12',
  }).format(value)
}

export type DateTimePickerCalendarProps = {
  time?: ReactNode,
  layoutRef?: Ref<ComponentRef<typeof CalendarDatePicker.Layout>>,
  layoutProps?: CalendarDatePickerLayoutProps,
}

export function DateTimePickerCalendar({
  time,
  layoutRef,
  layoutProps,
}: DateTimePickerCalendarProps) {
  const { state, dispatch, config } = useDateTimePickerContext()
  const [calendarState, setCalendarState] = useControlledState<CalendarDatePickerState>({
    defaultValue: {
      value: state.value,
      displayedMonth: new Date(state.value.getFullYear(), state.value.getMonth(), 1),
      displayMode: config.initialDisplay ?? 'day',
    },
  })
  const binding = useStateMachineBinding<CalendarDatePickerState, Date>({
    state: calendarState,
    onStateChange: setCalendarState,
    onValueChange: (next) => dispatch({ type: 'setValue', value: next }),
    value: state.value,
    inject: useCallback((next: Date) => ({ value: next }), []),
    get: useCallback((current: CalendarDatePickerState) => current.value, []),
  })

  return (
    <CalendarDatePicker.StateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      start={config.start}
      end={config.end}
      weekStart={config.weekStart}
      markToday={config.markToday}
    >
      <CalendarDatePicker.Layout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <CalendarDatePicker.Header
          timeLabel={timeLabelFor(state.value, config.locale, config.is24HourFormat, config.precision)}
          hasTime={time !== undefined}
        />
        <CalendarDatePicker.Body time={time} />
      </CalendarDatePicker.Layout>
    </CalendarDatePicker.StateManager>
  )
}
