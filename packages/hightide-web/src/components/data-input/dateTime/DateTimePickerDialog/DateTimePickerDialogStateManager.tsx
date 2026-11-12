import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
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

export type DateTimePickerDialogStateManagerProps = DOMInputStateManagerProps<DateTimePickerDialogState, DateTimePickerDialogEvent> & {
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
  value,
  initialValue,
  onValueChange,
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
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded: Date | null | undefined): DateTimePickerDialogState => ({
      value: seeded ?? null,
      pickerValue: seeded ?? new Date(),
      step: 'date',
    }),
    transition: dateTimePickerDialogStateTransition,
    onStateChange,
    onStateEvent,
  })
  const valueTime = value === undefined ? undefined : value === null ? null : value.getTime()
  const previousTimeRef = useRef(valueTime)
  useEffect(() => {
    if (value === undefined || Object.is(previousTimeRef.current, valueTime)) {
      return
    }
    previousTimeRef.current = valueTime
    const current = machine.store.getSnapshot()
    machine.store.set({
      ...current,
      value,
      pickerValue: value ?? current.pickerValue,
    })
  }, [machine.store, value, valueTime])
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <DateTimePickerDialogContext.Provider value={contextValue}>
      {children}
    </DateTimePickerDialogContext.Provider>
  )
}
