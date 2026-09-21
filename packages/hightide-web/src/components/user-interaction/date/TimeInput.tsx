import clsx from 'clsx'
import { useCallback, useMemo, useRef } from 'react'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat } from '../../../global-contexts/localization/forward-exports'
import { Visibility } from '../../layout/Visibility'
import { Button } from '../Button'
import { NumberStepperInput } from '../input/NumberStepperInput'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from './TimePicker'
import type { StepperLoopEvent } from '@helpwave/hightide-utils/hooks'

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

export interface TimeInputProps extends Partial<FormFieldDataHandling<Date>> {
  initialValue?: Date,
  is24HourFormat?: boolean,
  allowLooping?: boolean,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  className?: string,
}

function to12HourDisplay(hours: number) {
  return hours % 12 || 12
}

function set12HourDisplay(date: Date, displayHour: number) {
  const isPM = date.getHours() >= 12
  const normalizedHour = displayHour === 12 ? 0 : displayHour
  date.setHours(normalizedHour + (isPM ? 12 : 0))
}

/**
 * A time input built from vertical number stepper fields
 */
export const TimeInput = ({
  value: controlledValue,
  initialValue = new Date(),
  onValueChange,
  onEditComplete,
  is24HourFormat: is24HourFormatOverride,
  minuteIncrement = '1min',
  secondIncrement = '1s',
  millisecondIncrement = '100ms',
  precision = 'minute',
  allowLooping = false,
  className,
}: TimeInputProps) => {
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const valueRef = useRef(value)
  valueRef.current = value

  const minuteStep = minuteSteps[minuteIncrement]
  const secondStep = secondSteps[secondIncrement]
  const millisecondStep = millisecondSteps[millisecondIncrement]

  const updateValue = useCallback((transformer: (date: Date) => void, isEditComplete: boolean = false) => {
    const nextDate = new Date(valueRef.current)
    transformer(nextDate)
    valueRef.current = nextDate
    setValue(nextDate)
    if(isEditComplete) onEditComplete?.(nextDate)
  }, [onEditComplete, setValue])

  const onHourLooped = ({ direction }: StepperLoopEvent) => {
    updateValue((date) => {
      date.setDate(date.getDate() + direction)
      if(!is24HourFormat) {
        date.setHours(date.getHours() - direction * 12)
      }
    })
  }
  const onMinuteLooped = ({ direction }: StepperLoopEvent) => {
    updateValue((date) => date.setHours(date.getHours() + direction))
  }
  const onSecondLooped = ({ direction }: StepperLoopEvent) => {
    updateValue((date) => date.setMinutes(date.getMinutes() + direction))
  }
  const onMillisecondLooped = ({ direction }: StepperLoopEvent) => {
    updateValue((date) => date.setSeconds(date.getSeconds() + direction))
  }

  const hourValue = useMemo(() =>
    is24HourFormat ? value.getHours() : to12HourDisplay(value.getHours())
  , [is24HourFormat, value])
  const isPM = value.getHours() >= 12

  const setHourValue = useCallback((nextHour: number) => {
    updateValue((date) => {
      const roundedHour = Math.round(nextHour)
      if (is24HourFormat) {
        date.setHours(roundedHour)
        return
      }
      set12HourDisplay(date, roundedHour)
    })
  }, [is24HourFormat, updateValue])

  const setMinuteValue = useCallback((nextMinute: number) => {
    updateValue((date) => date.setMinutes(Math.round(nextMinute)))
  }, [updateValue])

  const setSecondValue = useCallback((nextSecond: number) => {
    updateValue((date) => date.setSeconds(Math.round(nextSecond)))
  }, [updateValue])

  const setMillisecondValue = useCallback((nextMillisecond: number) => {
    updateValue((date) => date.setMilliseconds(Math.round(nextMillisecond)))
  }, [updateValue])

  const setPeriod = useCallback((targetPM: boolean) => {
    updateValue((date) => {
      const hours = date.getHours()
      const currentlyPM = hours >= 12
      if (currentlyPM === targetPM) {
        return
      }
      date.setHours(hours + (targetPM ? 12 : -12))
    })
  }, [updateValue])

  return (
    <div data-name="time-input" className={clsx('time-input', className)}>
      <NumberStepperInput
        layout="col"
        looping={allowLooping}
        approximateMaxCharacters={2}
        minimum={is24HourFormat ? 0 : 1}
        maximum={allowLooping ?
          (is24HourFormat ? 23.99 : 12.99) :
          (is24HourFormat ? 23 : 12)}
        value={hourValue}
        onValueChange={setHourValue}
        onEditComplete={setHourValue}
        formatDisplayedValue={padTwoDigits}
        onLooped={onHourLooped}
        data-name="time-input-hour"
        className="time-input-segment"
      />
      <span className="time-input-separator">:</span>
      <NumberStepperInput
        layout="col"
        looping={allowLooping}
        approximateMaxCharacters={2}
        minimum={0}
        maximum={59}
        stepSize={minuteStep}
        value={value.getMinutes()}
        onValueChange={setMinuteValue}
        onEditComplete={setMinuteValue}
        formatDisplayedValue={padTwoDigits}
        onLooped={onMinuteLooped}
        data-name="time-input-minute"
        className="time-input-segment"
      />
      <Visibility isVisible={precision === 'second' || precision === 'millisecond'}>
        <span className="time-input-separator">:</span>
        <NumberStepperInput
          layout="col"
          looping={allowLooping}
          approximateMaxCharacters={2}
          minimum={0}
          maximum={59}
          stepSize={secondStep}
          value={value.getSeconds()}
          onValueChange={setSecondValue}
          onEditComplete={setSecondValue}
          onLooped={onSecondLooped}
          data-name="time-input-second"
          className="time-input-segment"
        />
      </Visibility>
      <Visibility isVisible={precision === 'millisecond'}>
        <span className="time-input-separator">.</span>
        <NumberStepperInput
          layout="col"
          looping={allowLooping}
          approximateMaxCharacters={3}
          minimum={0}
          maximum={999}
          stepSize={millisecondStep}
          value={value.getMilliseconds()}
          onValueChange={setMillisecondValue}
          onEditComplete={setMillisecondValue}
          onLooped={onMillisecondLooped}
          data-name="time-input-millisecond"
          className="time-input-segment"
        />
      </Visibility>
      <Visibility isVisible={!is24HourFormat}>
        <div data-name="time-input-period" className="time-input-period">
          <Button
            size="sm"
            color={!isPM ? 'primary' : 'neutral'}
            onClick={() => setPeriod(false)}
            className="min-w-16"
          >
            AM
          </Button>
          <Button
            size="sm"
            color={isPM ? 'primary' : 'neutral'}
            onClick={() => setPeriod(true)}
            className="min-w-16"
          >
            PM
          </Button>
        </div>
      </Visibility>
    </div>
  )
}
