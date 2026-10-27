import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import type { CalendarDisplayMode } from '../CalendarDatePicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'

export type DateTimePickerState = {
  value: Date,
}

export type DateTimePickerEvent = {
  type: 'setValue',
  value: Date,
}

export function dateTimePickerStateTransition(
  _state: DateTimePickerState,
  event: DateTimePickerEvent
): DateTimePickerState {
  return { value: event.value }
}

export type DateTimePickerOptions = {
  mode: DateTimeFormat,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  is24HourFormat: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
  initialDisplay?: CalendarDisplayMode,
  locale: string,
}
