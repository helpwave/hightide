import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from './TimePickerOptions'

export type TimePickerState = {
  value: Date,
}

export type TimePickerEvent =
  | { type: 'setHours', hour: number }
  | { type: 'setMinutes', minute: number }
  | { type: 'setSeconds', second: number }
  | { type: 'setMilliseconds', millisecond: number }
  | { type: 'setPeriod', period: 'am' | 'pm' }

export type TimePickerTransitionOptions = {
  is24HourFormat: boolean,
}

const withDate = (value: Date, update: (date: Date) => void) => {
  const next = new Date(value)
  update(next)
  return next
}

export const timePickerStateTransition = (
  state: TimePickerState,
  event: TimePickerEvent,
  options: TimePickerTransitionOptions
): TimePickerState => {
  const isPM = state.value.getHours() > 11
  switch (event.type) {
  case 'setHours':
    return {
      value: withDate(state.value, (date) => {
        date.setHours(event.hour + (!options.is24HourFormat && isPM ? 12 : 0))
      }),
    }
  case 'setMinutes':
    return { value: withDate(state.value, (date) => date.setMinutes(event.minute)) }
  case 'setSeconds':
    return { value: withDate(state.value, (date) => date.setSeconds(event.second)) }
  case 'setMilliseconds':
    return { value: withDate(state.value, (date) => date.setMilliseconds(event.millisecond)) }
  case 'setPeriod': {
    const hours = state.value.getHours()
    if (event.period === 'am' && isPM) {
      return { value: withDate(state.value, (date) => date.setHours(hours - 12)) }
    }
    if (event.period === 'pm' && !isPM) {
      return { value: withDate(state.value, (date) => date.setHours(hours + 12)) }
    }
    return state
  }
  }
}

export type TimePickerColumnUnit = 'hour' | 'minute' | 'second' | 'millisecond'

export const defaultTimePickerPrecision: DateTimePrecision = 'minute'
export const defaultTimePickerMinuteIncrement: TimePickerMinuteIncrement = '5min'
export const defaultTimePickerSecondIncrement: TimePickerSecondIncrement = '5s'
export const defaultTimePickerMillisecondIncrement: TimePickerMillisecondIncrement = '100ms'
