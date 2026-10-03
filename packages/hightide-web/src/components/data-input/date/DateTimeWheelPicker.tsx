import clsx from 'clsx'
import { useControlledState } from '@helpwave/hightide-utils/hooks'

import type { InputComponentInterface } from '../input/Input'
import type { DateWheelPickerProps } from './DateWheelPicker'
import { DateWheelPicker } from './DateWheelPicker'
import type { TimeWheelPickerProps } from './TimeWheelPicker'
import { TimeWheelPicker } from './TimeWheelPicker'

export type DateTimeWheelPickerProps =
  InputComponentInterface<Date> &
  Pick<DateWheelPickerProps, 'start' | 'end' | 'isLooping' | 'loopingBehaviour'> &
  Pick<TimeWheelPickerProps, 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'> & {
    className?: string,
    dateWheelPickerProps?: Omit<DateWheelPickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'start' | 'end' | 'isLooping' | 'loopingBehaviour'>,
    timeWheelPickerProps?: Omit<TimeWheelPickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision' | 'isLooping' | 'loopingBehaviour'>,
  }

export const DateTimeWheelPicker = ({
  value: controlledValue,
  initialValue = new Date(),
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  start,
  end,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  className,
  dateWheelPickerProps,
  timeWheelPickerProps,
}: DateTimeWheelPickerProps) => {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })

  return (
    <div className={clsx('date-time-wheel-picker', className)}>
      <DateWheelPicker
        {...dateWheelPickerProps}
        value={value}
        start={start}
        end={end}
        isLooping={isLooping}
        loopingBehaviour={loopingBehaviour}
        onValueUpdate={setValue}
        onValueCommit={onEditComplete}
      />
      <TimeWheelPicker
        {...timeWheelPickerProps}
        value={value}
        is24HourFormat={is24HourFormat}
        minuteIncrement={minuteIncrement}
        secondIncrement={secondIncrement}
        millisecondIncrement={millisecondIncrement}
        precision={precision}
        isLooping={isLooping}
        loopingBehaviour={loopingBehaviour}
        onValueUpdate={setValue}
        onValueCommit={onEditComplete}
      />
    </div>
  )
}
