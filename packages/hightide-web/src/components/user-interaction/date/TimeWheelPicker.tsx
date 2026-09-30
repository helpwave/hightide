import clsx from 'clsx'
import { useCallback, useMemo, useRef } from 'react'
import { closestMatch, range, type DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useControlledState } from '@helpwave/hightide-utils/hooks'

import { useDateTimeFormat } from '../../../global-contexts/localization/forward-exports'
import type { InputInterface } from '../input/Input'
import { Visibility } from '../../layout/Visibility'
import { WheelPicker, type WheelPickerLoopEvent } from '../WheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from './TimePicker'

const padTwoDigits = (value: number) => String(Math.round(value)).padStart(2, '0')

const minuteSteps: Record<TimePickerMinuteIncrement, number> = {
  '1min': 1,
  '5min': 5,
  '10min': 10,
  '15min': 15,
  '30min': 30,
}

const secondSteps: Record<TimePickerSecondIncrement, number> = {
  '1s': 1,
  '5s': 5,
  '10s': 10,
  '15s': 15,
  '30s': 30,
}

const millisecondSteps: Record<TimePickerMillisecondIncrement, number> = {
  '1ms': 1,
  '5ms': 5,
  '10ms': 10,
  '25ms': 25,
  '50ms': 50,
  '100ms': 100,
  '250ms': 250,
  '500ms': 500,
}

export type WheelLoopingBehaviour = 'ignore' | 'update'

function steppedValues(length: number, step: number) {
  return range(length).filter((value) => value % step === 0)
}

function to12HourDisplay(hours: number) {
  return hours % 12 || 12
}

function shiftDate(date: Date, direction: 1 | -1, loopingBehaviour: WheelLoopingBehaviour) {
  if (loopingBehaviour === 'ignore') {
    return
  }
  date.setDate(date.getDate() + direction)
}

function shiftUnit(
  date: Date,
  read: (date: Date) => number,
  write: (date: Date, value: number) => void,
  direction: 1 | -1,
  minimum: number,
  maximum: number,
  loopingBehaviour: WheelLoopingBehaviour
) {
  const next = read(date) + direction
  if (loopingBehaviour === 'ignore' && (next < minimum || next > maximum)) {
    return
  }
  write(date, next)
}

function set12HourDisplay(date: Date, displayHour: number, loopingBehaviour: WheelLoopingBehaviour) {
  const currentDisplay = to12HourDisplay(date.getHours())
  const isPM = date.getHours() >= 12
  let nextIsPM = isPM
  if (currentDisplay === 11 && displayHour === 12) {
    nextIsPM = !isPM
    if (isPM) {
      shiftDate(date, 1, loopingBehaviour)
    }
  } else if (currentDisplay === 12 && displayHour === 11) {
    nextIsPM = !isPM
    if (!isPM) {
      shiftDate(date, -1, loopingBehaviour)
    }
  }
  const normalizedHour = displayHour === 12 ? 0 : displayHour
  date.setHours(normalizedHour + (nextIsPM ? 12 : 0))
}

export interface TimeWheelPickerProps extends InputInterface<Date> {
  is24HourFormat?: boolean,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  className?: string,
}

type NumericWheelProps = {
  value: number,
  options: number[],
  onValueChange: (value: number) => void,
  onLoop?: (event: WheelPickerLoopEvent<number>) => void,
  isLooping?: boolean,
  formatValue?: (value: number) => string,
}

function NumericWheel({
  value,
  options,
  onValueChange,
  onLoop,
  isLooping = false,
  formatValue = padTwoDigits,
}: NumericWheelProps) {
  return (
    <WheelPicker value={value} onValueChange={onValueChange} onLoop={onLoop} isLooping={isLooping}>
      {options.map((option) => (
        <WheelPicker.Option key={option} value={option} valueId={String(option)}>
          {formatValue(option)}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}

export const TimeWheelPicker = ({
  value: controlledValue,
  initialValue = new Date(),
  onValueChange,
  onEditComplete,
  is24HourFormat: is24HourFormatOverride,
  minuteIncrement = '1min',
  secondIncrement = '1s',
  millisecondIncrement = '100ms',
  precision = 'minute',
  isLooping = true,
  loopingBehaviour = 'update',
  className,
}: TimeWheelPickerProps) => {
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const valueRef = useRef(value)
  valueRef.current = value

  const hours = useMemo(
    () => is24HourFormat ? range(24) : range(12).map((hour) => hour + 1),
    [is24HourFormat]
  )
  const minutes = useMemo(() => steppedValues(60, minuteSteps[minuteIncrement]), [minuteIncrement])
  const seconds = useMemo(() => steppedValues(60, secondSteps[secondIncrement]), [secondIncrement])
  const milliseconds = useMemo(
    () => steppedValues(1000, millisecondSteps[millisecondIncrement]),
    [millisecondIncrement]
  )

  const hourValue = is24HourFormat ? value.getHours() : to12HourDisplay(value.getHours())
  const minuteValue = closestMatch(minutes, (left, right) =>
    Math.abs(left - value.getMinutes()) < Math.abs(right - value.getMinutes()))
  const secondValue = closestMatch(seconds, (left, right) =>
    Math.abs(left - value.getSeconds()) < Math.abs(right - value.getSeconds()))
  const millisecondValue = closestMatch(milliseconds, (left, right) =>
    Math.abs(left - value.getMilliseconds()) < Math.abs(right - value.getMilliseconds()))
  const period = value.getHours() >= 12 ? 'pm' : 'am'

  const updateValue = useCallback((transformer: (date: Date) => void) => {
    const nextDate = new Date(valueRef.current)
    transformer(nextDate)
    valueRef.current = nextDate
    setValue(nextDate)
    onEditComplete?.(nextDate)
  }, [onEditComplete, setValue])

  return (
    <div className={clsx('time-wheel-picker', className)}>
      <NumericWheel
        value={hourValue}
        options={hours}
        isLooping={isLooping}
        onValueChange={(hour) => updateValue((date) => {
          if (is24HourFormat) {
            date.setHours(hour)
            return
          }
          set12HourDisplay(date, hour, loopingBehaviour)
        })}
        onLoop={({ direction }) => updateValue((date) => {
          if (is24HourFormat) {
            shiftDate(date, direction, loopingBehaviour)
            return
          }
          const displayHour = to12HourDisplay(date.getHours())
          const isPM = date.getHours() >= 12
          if (direction === 1 && isPM) {
            shiftDate(date, 1, loopingBehaviour)
          }
          if (direction === -1 && !isPM) {
            shiftDate(date, -1, loopingBehaviour)
          }
          const normalizedHour = displayHour === 12 ? 0 : displayHour
          date.setHours(normalizedHour + (isPM ? 0 : 12))
        })}
      />
      <span className="time-wheel-picker-separator">:</span>
      <NumericWheel
        value={minuteValue}
        options={minutes}
        isLooping={isLooping}
        onValueChange={(minute) => updateValue((date) => date.setMinutes(minute))}
        onLoop={({ direction }) => updateValue((date) => {
          shiftUnit(date, (current) => current.getHours(), (current, hour) => current.setHours(hour), direction, 0, 23, loopingBehaviour)
        })}
      />
      <Visibility isVisible={precision === 'second' || precision === 'millisecond'}>
        <span className="time-wheel-picker-separator">:</span>
        <NumericWheel
          value={secondValue}
          options={seconds}
          isLooping={isLooping}
          onValueChange={(second) => updateValue((date) => date.setSeconds(second))}
          onLoop={({ direction }) => updateValue((date) => {
            shiftUnit(date, (current) => current.getMinutes(), (current, minute) => current.setMinutes(minute), direction, 0, 59, loopingBehaviour)
          })}
        />
      </Visibility>
      <Visibility isVisible={precision === 'millisecond'}>
        <span className="time-wheel-picker-separator">.</span>
        <NumericWheel
          value={millisecondValue}
          options={milliseconds}
          isLooping={isLooping}
          onValueChange={(millisecond) => updateValue((date) => date.setMilliseconds(millisecond))}
          onLoop={({ direction }) => updateValue((date) => {
            shiftUnit(date, (current) => current.getSeconds(), (current, second) => current.setSeconds(second), direction, 0, 59, loopingBehaviour)
          })}
        />
      </Visibility>
      <Visibility isVisible={!is24HourFormat}>
        <WheelPicker
          value={period}
          onValueChange={(nextPeriod) => updateValue((date) => {
            const hoursOnDate = date.getHours()
            const isPM = hoursOnDate >= 12
            const targetPM = nextPeriod === 'pm'
            if (isPM === targetPM) {
              return
            }
            date.setHours(hoursOnDate + (targetPM ? 12 : -12))
          })}
        >
          <WheelPicker.Option value="am">AM</WheelPicker.Option>
          <WheelPicker.Option value="pm">PM</WheelPicker.Option>
        </WheelPicker>
      </Visibility>
    </div>
  )
}
