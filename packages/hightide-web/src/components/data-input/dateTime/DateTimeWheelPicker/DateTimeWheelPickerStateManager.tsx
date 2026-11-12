import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
import { DateTimeWheelPickerContext, type DateTimeWheelPickerContextConfig } from './DateTimeWheelPickerContext'
import {
  dateTimeWheelPickerStateTransition,
  type DateTimeWheelPickerEvent,
  type DateTimeWheelPickerOptions,
  type DateTimeWheelPickerState
} from './DateTimeWheelPickerState'

export type DateTimeWheelPickerStateManagerProps =
  DOMInputStateManagerProps<DateTimeWheelPickerState, DateTimeWheelPickerEvent> &
  DateTimeWheelPickerOptions

export function DateTimeWheelPickerStateManager({
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
  start,
  end,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  children,
}: DateTimeWheelPickerStateManagerProps) {
  const config = useMemo<DateTimeWheelPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    start,
    end,
    isLooping,
    loopingBehaviour,
    is24HourFormat,
    minuteIncrement,
    secondIncrement,
    millisecondIncrement,
    precision,
  }), [end, is24HourFormat, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, loopingBehaviour, millisecondIncrement, minuteIncrement, precision, secondIncrement, start, id])
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => ({ value: seeded ?? new Date() }),
    transition: dateTimeWheelPickerStateTransition,
    onStateChange,
    onStateEvent,
  })
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <DateTimeWheelPickerContext.Provider value={contextValue}>
      {children}
    </DateTimeWheelPickerContext.Provider>
  )
}
