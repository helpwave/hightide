import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import { DateTimeWheelPickerContext, type DateTimeWheelPickerContextConfig } from './DateTimeWheelPickerContext'
import {
  dateTimeWheelPickerStateTransition,
  type DateTimeWheelPickerEvent,
  type DateTimeWheelPickerOptions,
  type DateTimeWheelPickerState
} from './DateTimeWheelPickerState'

export type DateTimeWheelPickerStateManagerProps =
  DOMInputStateMangerProps<DateTimeWheelPickerState, DateTimeWheelPickerEvent> &
  DateTimeWheelPickerOptions & {
    children?: ReactNode,
  }

export function DateTimeWheelPickerStateManager({
  state,
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
  const contextValue = useDateStateMachine({
    state,
    transition: dateTimeWheelPickerStateTransition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <DateTimeWheelPickerContext.Provider value={contextValue}>
      {children}
    </DateTimeWheelPickerContext.Provider>
  )
}
