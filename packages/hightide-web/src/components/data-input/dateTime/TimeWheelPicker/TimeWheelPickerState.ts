import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'

export type WheelLoopingBehaviour = 'ignore' | 'update'

export type TimeWheelPickerState = {
  value: Date,
}

export type TimeWheelPickerEvent =
  | { type: 'setHour', hour: number }
  | { type: 'loopHour', direction: 1 | -1 }
  | { type: 'setMinute', minute: number }
  | { type: 'loopMinute', direction: 1 | -1 }
  | { type: 'setSecond', second: number }
  | { type: 'loopSecond', direction: 1 | -1 }
  | { type: 'setMillisecond', millisecond: number }
  | { type: 'loopMillisecond', direction: 1 | -1 }
  | { type: 'setPeriod', period: 'am' | 'pm' }

export type TimeWheelPickerTransitionOptions = {
  is24HourFormat: boolean,
  loopingBehaviour: WheelLoopingBehaviour,
}

export const defaultTimeWheelPrecision: DateTimePrecision = 'minute'
export const defaultTimeWheelMinuteIncrement: TimePickerMinuteIncrement = '1min'
export const defaultTimeWheelSecondIncrement: TimePickerSecondIncrement = '1s'
export const defaultTimeWheelMillisecondIncrement: TimePickerMillisecondIncrement = '100ms'
export const defaultWheelLoopingBehaviour: WheelLoopingBehaviour = 'update'

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

export const timeWheelMinuteStep = minuteSteps
export const timeWheelSecondStep = secondSteps
export const timeWheelMillisecondStep = millisecondSteps

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

function apply(value: Date, update: (date: Date) => void): TimeWheelPickerState {
  const next = new Date(value)
  update(next)
  return { value: next }
}

export function timeWheelPickerStateTransition(
  state: TimeWheelPickerState,
  event: TimeWheelPickerEvent,
  options: TimeWheelPickerTransitionOptions
): TimeWheelPickerState {
  const { is24HourFormat, loopingBehaviour } = options
  switch (event.type) {
  case 'setHour':
    return apply(state.value, (date) => {
      if (is24HourFormat) {
        date.setHours(event.hour)
        return
      }
      set12HourDisplay(date, event.hour, loopingBehaviour)
    })
  case 'loopHour':
    return apply(state.value, (date) => {
      if (is24HourFormat) {
        shiftDate(date, event.direction, loopingBehaviour)
        return
      }
      const displayHour = to12HourDisplay(date.getHours())
      const isPM = date.getHours() >= 12
      if (event.direction === 1 && isPM) {
        shiftDate(date, 1, loopingBehaviour)
      }
      if (event.direction === -1 && !isPM) {
        shiftDate(date, -1, loopingBehaviour)
      }
      const normalizedHour = displayHour === 12 ? 0 : displayHour
      date.setHours(normalizedHour + (isPM ? 0 : 12))
    })
  case 'setMinute':
    return apply(state.value, (date) => date.setMinutes(event.minute))
  case 'loopMinute':
    return apply(state.value, (date) => {
      shiftUnit(date, (current) => current.getHours(), (current, hour) => current.setHours(hour), event.direction, 0, 23, loopingBehaviour)
    })
  case 'setSecond':
    return apply(state.value, (date) => date.setSeconds(event.second))
  case 'loopSecond':
    return apply(state.value, (date) => {
      shiftUnit(date, (current) => current.getMinutes(), (current, minute) => current.setMinutes(minute), event.direction, 0, 59, loopingBehaviour)
    })
  case 'setMillisecond':
    return apply(state.value, (date) => date.setMilliseconds(event.millisecond))
  case 'loopMillisecond':
    return apply(state.value, (date) => {
      shiftUnit(date, (current) => current.getSeconds(), (current, second) => current.setSeconds(second), event.direction, 0, 59, loopingBehaviour)
    })
  case 'setPeriod': {
    const hoursOnDate = state.value.getHours()
    const isPM = hoursOnDate >= 12
    const isTargetPM = event.period === 'pm'
    if (isPM === isTargetPM) {
      return state
    }
    return apply(state.value, (date) => date.setHours(hoursOnDate + (isTargetPM ? 12 : -12)))
  }
  }
}

export function toTimeWheelHour(date: Date, is24HourFormat: boolean) {
  if (is24HourFormat) {
    return date.getHours()
  }
  return to12HourDisplay(date.getHours())
}
