import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'

export type DateTimeWheelPickerState = {
  value: Date,
}

export type DateTimeWheelPickerEvent = {
  type: 'setValue',
  value: Date,
}

export function dateTimeWheelPickerStateTransition(
  _state: DateTimeWheelPickerState,
  event: DateTimeWheelPickerEvent
): DateTimeWheelPickerState {
  return { value: event.value }
}

export type DateTimeWheelPickerOptions = {
  start?: Date,
  end?: Date,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
}
