import type { HTMLAttributes } from 'react'
import { type ReactNode } from 'react'
import type { DateTimeFormat } from '@helpwave/hightide-utils/utils'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import clsx from 'clsx'

import { useDateTimeFormat, useLocalization } from '../../../global-contexts/localization/forward-exports'
import type { InputComponentInterface } from '../input/TextInput'
import type { CalendarDatePickerProps } from './CalendarDatePicker'
import { CalendarDatePicker } from './CalendarDatePicker'
import type { TimeWheelPickerProps } from './TimeWheelPicker'
import { TimeWheelPicker } from './TimeWheelPicker'

export interface DateTimePickerProps extends
HTMLAttributes<HTMLDivElement>,
InputComponentInterface<Date>,
Pick<CalendarDatePickerProps, 'start' | 'end' | 'weekStart' | 'markToday'>,
Pick<TimeWheelPickerProps, 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  mode?: DateTimeFormat,
  calendarDatePickerProps?: Omit<CalendarDatePickerProps, 'onChange' | 'value' | 'start' | 'end' | 'markToday'>,
  timeInputProps?: Omit<TimeWheelPickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start,
  end,
  mode = 'dateTime',
  is24HourFormat,
  minuteIncrement,
  weekStart,
  secondIncrement,
  millisecondIncrement,
  precision,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  timeInputProps,
  calendarDatePickerProps,
  ...props
}: DateTimePickerProps) => {
  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'
  const { locale } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const resolvedIs24HourFormat = is24HourFormat ?? contextIs24HourFormat
  const timeLabel = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: precision === 'second' || precision === 'millisecond' ? '2-digit' : undefined,
    hourCycle: resolvedIs24HourFormat ? 'h23' : 'h12',
  }).format(value)

  const timePicker = (
    <TimeWheelPicker
      {...timeInputProps}
      is24HourFormat={is24HourFormat}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
      precision={precision}
      value={value}
      onValueUpdate={setValue}
      onValueCommit={onEditComplete}
    />
  )

  let content: ReactNode
  if (useDate && useTime) {
    content = (
      <CalendarDatePicker
        {...calendarDatePickerProps}
        start={start}
        end={end}
        weekStart={weekStart}
        value={value}
        onValueUpdate={setValue}
        onValueCommit={onEditComplete}
        timeLabel={timeLabel}
        timePicker={timePicker}
      />
    )
  } else if (useDate) {
    content = (
      <CalendarDatePicker
        {...calendarDatePickerProps}
        start={start}
        end={end}
        weekStart={weekStart}
        value={value}
        onValueUpdate={setValue}
        onValueCommit={onEditComplete}
      />
    )
  } else {
    content = timePicker
  }

  return (
    <div {...props} className={clsx('date-time-picker', props.className)} data-mode={mode}>
      {content}
    </div>
  )
}
