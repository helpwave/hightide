import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { range, type DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import { TimeWheelPickerContext, type TimeWheelPickerContextConfig } from './TimeWheelPickerContext'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import {
  defaultTimeWheelMillisecondIncrement,
  defaultTimeWheelMinuteIncrement,
  defaultTimeWheelPrecision,
  defaultTimeWheelSecondIncrement,
  defaultWheelLoopingBehaviour,
  timeWheelMillisecondStep,
  timeWheelMinuteStep,
  timeWheelPickerStateTransition,
  timeWheelSecondStep,
  type TimeWheelPickerEvent,
  type TimeWheelPickerState,
  type WheelLoopingBehaviour
} from './TimeWheelPickerState'

const stepped = (length: number, step: number) => range(length).filter((value) => value % step === 0)

export type TimeWheelPickerStateManagerProps = DOMInputStateMangerProps<TimeWheelPickerState, TimeWheelPickerEvent> & {
  children?: ReactNode,
  is24HourFormat?: boolean,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
}

export function TimeWheelPickerStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  is24HourFormat: is24HourFormatOverride,
  isLooping = true,
  loopingBehaviour = defaultWheelLoopingBehaviour,
  precision = defaultTimeWheelPrecision,
  minuteIncrement = defaultTimeWheelMinuteIncrement,
  secondIncrement = defaultTimeWheelSecondIncrement,
  millisecondIncrement = defaultTimeWheelMillisecondIncrement,
  children,
}: TimeWheelPickerStateManagerProps) {
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const transition = useMemo(() => {
    return (current: TimeWheelPickerState, event: TimeWheelPickerEvent) => timeWheelPickerStateTransition(current, event, {
      is24HourFormat,
      loopingBehaviour,
    })
  }, [is24HourFormat, loopingBehaviour])
  const config = useMemo<TimeWheelPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    is24HourFormat,
    isLooping,
    loopingBehaviour,
    precision,
    hours: is24HourFormat ? range(24) : range(12).map((hour) => hour + 1),
    minutes: stepped(60, timeWheelMinuteStep[minuteIncrement]),
    seconds: stepped(60, timeWheelSecondStep[secondIncrement]),
    milliseconds: stepped(1000, timeWheelMillisecondStep[millisecondIncrement]),
  }), [is24HourFormat, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, loopingBehaviour, millisecondIncrement, minuteIncrement, precision, secondIncrement, id])
  const contextValue = useDateStateMachine({
    state,
    transition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <TimeWheelPickerContext.Provider value={contextValue}>
      {children}
    </TimeWheelPickerContext.Provider>
  )
}
