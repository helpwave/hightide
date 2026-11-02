import type { ComponentRef, Ref } from 'react'
import type { CalendarDatePickerLayout, CalendarDatePickerLayoutProps } from '../CalendarDatePicker'
import type { TimeWheelPickerLayout, TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { DateTimePickerCalendar } from './DateTimePickerCalendar'
import { useDateTimePickerContext } from './DateTimePickerContext'
import { DateTimePickerTime } from './DateTimePickerTime'

export type DateTimePickerContentProps = {
  calendarRef?: Ref<ComponentRef<typeof CalendarDatePickerLayout>>,
  calendarProps?: CalendarDatePickerLayoutProps,
  timeRef?: Ref<ComponentRef<typeof TimeWheelPickerLayout>>,
  timeProps?: TimeWheelPickerLayoutProps,
}

export function DateTimePickerContent({
  calendarRef,
  calendarProps,
  timeRef,
  timeProps,
}: DateTimePickerContentProps) {
  const { config } = useDateTimePickerContext()
  const hasDate = config.mode === 'date' || config.mode === 'dateTime'
  const hasTime = config.mode === 'time' || config.mode === 'dateTime'
  const timeNode = <DateTimePickerTime layoutRef={timeRef} layoutProps={timeProps} />

  if (hasDate && hasTime) {
    return (
      <DateTimePickerCalendar
        time={timeNode}
        layoutRef={calendarRef}
        layoutProps={calendarProps}
      />
    )
  }
  if (hasDate) {
    return (
      <DateTimePickerCalendar
        layoutRef={calendarRef}
        layoutProps={calendarProps}
      />
    )
  }
  return timeNode
}
