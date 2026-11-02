import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { DateTimePickerDialogContext, type DateTimePickerDialogContextConfig } from './DateTimePickerDialogContext'
import {
  dateTimePickerDialogStateTransition,
  type DateTimePickerDialogEvent,
  type DateTimePickerDialogState
} from './DateTimePickerDialogState'

export type DateTimePickerDialogStateManagerProps = DOMInputStateMangerProps<DateTimePickerDialogState, DateTimePickerDialogEvent> & {
  children?: ReactNode,
  mode?: DateTimeFormat,
  allowRemove?: boolean,
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

export function DateTimePickerDialogStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  mode = 'date',
  allowRemove = true,
  label,
  labelId,
  start,
  end,
  weekStart,
  markToday,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  children,
}: DateTimePickerDialogStateManagerProps) {
  const config = useMemo<DateTimePickerDialogContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    mode,
    allowRemove,
    label,
    labelId,
    start,
    end,
    weekStart,
    markToday,
    isLooping,
    loopingBehaviour,
    is24HourFormat,
    minuteIncrement,
    secondIncrement,
    millisecondIncrement,
    precision,
  }), [allowRemove, end, is24HourFormat, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, label, labelId, loopingBehaviour, markToday, millisecondIncrement, minuteIncrement, mode, precision, secondIncrement, start, weekStart, id])
  const contextValue = useDateStateMachine({
    state,
    transition: dateTimePickerDialogStateTransition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <DateTimePickerDialogContext.Provider value={contextValue}>
      {children}
    </DateTimePickerDialogContext.Provider>
  )
}
