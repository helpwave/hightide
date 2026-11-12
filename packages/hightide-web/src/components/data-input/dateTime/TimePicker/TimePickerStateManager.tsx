import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { range } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat } from '../../../../global-contexts/localization/forward-exports'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
import { TimePickerContext, type TimePickerContextConfig } from './TimePickerContext'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from './TimePickerOptions'
import {
  defaultTimePickerMillisecondIncrement,
  defaultTimePickerMinuteIncrement,
  defaultTimePickerPrecision,
  defaultTimePickerSecondIncrement,
  timePickerStateTransition,
  type TimePickerEvent,
  type TimePickerState
} from './TimePickerState'

const stepped = (length: number, step: number) => range(length).filter((value) => value % step === 0)

const minuteStep: Record<TimePickerMinuteIncrement, number> = {
  '1min': 1,
  '5min': 5,
  '10min': 10,
  '15min': 15,
  '30min': 30,
}

const secondStep: Record<TimePickerSecondIncrement, number> = {
  '1s': 1,
  '5s': 5,
  '10s': 10,
  '15s': 15,
  '30s': 30,
}

const millisecondStep: Record<TimePickerMillisecondIncrement, number> = {
  '1ms': 1,
  '5ms': 5,
  '10ms': 10,
  '25ms': 25,
  '50ms': 50,
  '100ms': 100,
  '250ms': 250,
  '500ms': 500,
}

export type TimePickerStateManagerProps = DOMInputStateManagerProps<TimePickerState, TimePickerEvent> & {
  is24HourFormat?: boolean,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
}

export function TimePickerStateManager({
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
  is24HourFormat: is24HourFormatOverride,
  precision = defaultTimePickerPrecision,
  minuteIncrement = defaultTimePickerMinuteIncrement,
  secondIncrement = defaultTimePickerSecondIncrement,
  millisecondIncrement = defaultTimePickerMillisecondIncrement,
  children,
}: TimePickerStateManagerProps) {
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const transition = useMemo(() => {
    return (current: TimePickerState, event: TimePickerEvent) => timePickerStateTransition(current, event, { is24HourFormat })
  }, [is24HourFormat])
  const config = useMemo<TimePickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    is24HourFormat,
    precision,
    hours: is24HourFormat ? range(24) : range(12),
    minutes: stepped(60, minuteStep[minuteIncrement]),
    seconds: stepped(60, secondStep[secondIncrement]),
    milliseconds: stepped(1000, millisecondStep[millisecondIncrement]),
  }), [is24HourFormat, isDisabled, isInvalid, isReadOnly, isRequired, millisecondIncrement, minuteIncrement, precision, secondIncrement, id])
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => ({ value: seeded ?? new Date() }),
    transition,
    onStateChange,
    onStateEvent,
  })
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <TimePickerContext.Provider value={contextValue}>
      {children}
    </TimePickerContext.Provider>
  )
}
