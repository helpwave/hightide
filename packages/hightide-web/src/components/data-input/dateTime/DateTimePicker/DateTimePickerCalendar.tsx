import type { ComponentRef, ReactNode, Ref } from 'react'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CalendarDatePicker, type CalendarDatePickerLayoutProps } from '../CalendarDatePicker'
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

  return (
    <CalendarDatePicker.StateManager
      value={state.value}
      onValueChange={(next) => dispatch({ type: 'setValue', value: next })}
      initialDisplay={config.initialDisplay}
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
