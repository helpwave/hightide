import type { ReactNode } from 'react'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'

export type DateTimePickerDialogStep = 'date' | 'time'

export type DateTimePickerDialogState = {
  value: Date | null,
  pickerValue: Date,
  step: DateTimePickerDialogStep,
}

export type DateTimePickerDialogEvent =
  | { type: 'pick', value: Date }
  | { type: 'setStep', step: DateTimePickerDialogStep }
  | { type: 'commit', value: Date | null }

export function dateTimePickerDialogStateTransition(
  state: DateTimePickerDialogState,
  event: DateTimePickerDialogEvent
): DateTimePickerDialogState {
  switch (event.type) {
  case 'pick':
    return { ...state, pickerValue: event.value }
  case 'setStep':
    return { ...state, step: event.step }
  case 'commit':
    return {
      ...state,
      value: event.value,
      pickerValue: event.value ?? state.pickerValue,
    }
  }
}

export type DateTimePickerDialogOptions = {
  mode: DateTimeFormat,
  allowRemove: boolean,
  label?: ReactNode,
  labelId?: string,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
}
