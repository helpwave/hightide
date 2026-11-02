import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useBoundDateState } from '../useDateStateMachine'
import { TimePickerContext } from './TimePickerContext'
import { TimePickerColumn, type TimePickerColumnProps } from './TimePickerColumn'
import { TimePickerLayout, type TimePickerLayoutProps } from './TimePickerLayout'
import { TimePickerPeriod, type TimePickerPeriodProps } from './TimePickerPeriod'
import { TimePickerTrigger } from './TimePickerTrigger'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from './TimePickerOptions'
import { TimePickerStateManager } from './TimePickerStateManager'
import {
  defaultTimePickerMillisecondIncrement,
  defaultTimePickerMinuteIncrement,
  defaultTimePickerPrecision,
  defaultTimePickerSecondIncrement,
  type TimePickerEvent,
  type TimePickerState
} from './TimePickerState'

export type TimePickerProps = ControllableDOMInputProps<Date, TimePickerEvent> & {
  is24HourFormat?: boolean,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  layoutRef?: Ref<ComponentRef<typeof TimePickerLayout>>,
  layoutProps?: TimePickerLayoutProps,
  hourColumnRef?: Ref<ComponentRef<typeof TimePickerColumn>>,
  hourColumnProps?: TimePickerColumnProps,
  minuteColumnRef?: Ref<ComponentRef<typeof TimePickerColumn>>,
  minuteColumnProps?: TimePickerColumnProps,
  secondColumnRef?: Ref<ComponentRef<typeof TimePickerColumn>>,
  secondColumnProps?: TimePickerColumnProps,
  millisecondColumnRef?: Ref<ComponentRef<typeof TimePickerColumn>>,
  millisecondColumnProps?: TimePickerColumnProps,
  periodRef?: Ref<ComponentRef<typeof TimePickerPeriod>>,
  periodProps?: TimePickerPeriodProps,
}

const TimePickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  is24HourFormat,
  precision = defaultTimePickerPrecision,
  minuteIncrement = defaultTimePickerMinuteIncrement,
  secondIncrement = defaultTimePickerSecondIncrement,
  millisecondIncrement = defaultTimePickerMillisecondIncrement,
  layoutRef,
  layoutProps,
  hourColumnRef,
  hourColumnProps,
  minuteColumnRef,
  minuteColumnProps,
  secondColumnRef,
  secondColumnProps,
  millisecondColumnRef,
  millisecondColumnProps,
  periodRef,
  periodProps,
}: TimePickerProps) => {
  const binding = useBoundDateState<TimePickerState>({
    value: value ?? initialValue,
  }, value, onValueChange)

  return (
    <TimePickerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      is24HourFormat={is24HourFormat}
      precision={precision}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
    >
      <TimePickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <TimePickerColumn
          ref={ReactUtils.assingRefsBuilder([hourColumnRef])}
          unit="hour"
          {...hourColumnProps}
        />
        <TimePickerColumn
          ref={ReactUtils.assingRefsBuilder([minuteColumnRef])}
          unit="minute"
          {...minuteColumnProps}
        />
        <TimePickerColumn
          ref={ReactUtils.assingRefsBuilder([secondColumnRef])}
          unit="second"
          {...secondColumnProps}
        />
        <TimePickerColumn
          ref={ReactUtils.assingRefsBuilder([millisecondColumnRef])}
          unit="millisecond"
          {...millisecondColumnProps}
        />
        <TimePickerPeriod
          ref={ReactUtils.assingRefsBuilder([periodRef])}
          {...periodProps}
        />
      </TimePickerLayout>
    </TimePickerStateManager>
  )
}

export const TimePicker = Object.assign(TimePickerComponent, {
  StateManager: TimePickerStateManager,
  Layout: TimePickerLayout,
  Column: TimePickerColumn,
  Trigger: TimePickerTrigger,
  Period: TimePickerPeriod,
  Context: TimePickerContext,
  Provider: TimePickerContext.Provider,
  Consumer: TimePickerContext.Consumer,
})
