import { closestMatch } from '@helpwave/hightide-utils/utils'
import { WheelPicker } from '../../../interaction/WheelPicker'
import { useTimeWheelPickerContext } from './TimeWheelPickerContext'
import { toTimeWheelHour } from './TimeWheelPickerState'

const padTwoDigits = (value: number) => String(Math.round(value)).padStart(2, '0')

export type TimeWheelPickerWheelUnit = 'hour' | 'minute' | 'second' | 'millisecond'

export type TimeWheelPickerWheelProps = {
  unit: TimeWheelPickerWheelUnit,
}

export function TimeWheelPickerWheel({ unit }: TimeWheelPickerWheelProps) {
  const { state, dispatch, config } = useTimeWheelPickerContext()
  const hasSeconds = config.precision === 'second' || config.precision === 'millisecond'
  const hasMilliseconds = config.precision === 'millisecond'
  if ((unit === 'second' && !hasSeconds) || (unit === 'millisecond' && !hasMilliseconds)) {
    return null
  }
  const options = unit === 'hour'
    ? config.hours
    : unit === 'minute'
      ? config.minutes
      : unit === 'second'
        ? config.seconds
        : config.milliseconds
  const selected = unit === 'hour'
    ? toTimeWheelHour(state.value, config.is24HourFormat)
    : unit === 'minute'
      ? closestMatch(options, (left, right) => Math.abs(left - state.value.getMinutes()) < Math.abs(right - state.value.getMinutes()))
      : unit === 'second'
        ? closestMatch(options, (left, right) => Math.abs(left - state.value.getSeconds()) < Math.abs(right - state.value.getSeconds()))
        : closestMatch(options, (left, right) => Math.abs(left - state.value.getMilliseconds()) < Math.abs(right - state.value.getMilliseconds()))
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={selected}
      isLooping={config.isLooping}
      disabled={isLocked}
      onValueChange={(next) => {
        if (isLocked) {
          return
        }
        dispatch(unit === 'hour'
          ? { type: 'setHour', hour: next }
          : unit === 'minute'
            ? { type: 'setMinute', minute: next }
            : unit === 'second'
              ? { type: 'setSecond', second: next }
              : { type: 'setMillisecond', millisecond: next })
      }}
      onLoop={({ direction }) => {
        if (isLocked) {
          return
        }
        dispatch(unit === 'hour'
          ? { type: 'loopHour', direction }
          : unit === 'minute'
            ? { type: 'loopMinute', direction }
            : unit === 'second'
              ? { type: 'loopSecond', direction }
              : { type: 'loopMillisecond', direction })
      }}
    >
      {options.map((option) => (
        <WheelPicker.Option key={option} value={option} valueId={String(option)}>
          {padTwoDigits(option)}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}
