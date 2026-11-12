import type { ComponentRef, Ref } from 'react'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { TimeWheelPickerContext } from './TimeWheelPickerContext'
import { TimeWheelPickerLayout, type TimeWheelPickerLayoutProps } from './TimeWheelPickerLayout'
import { TimeWheelPickerPeriod } from './TimeWheelPickerPeriod'
import { TimeWheelPickerSeparator } from './TimeWheelPickerSeparator'
import { TimeWheelPickerWheel } from './TimeWheelPickerWheel'
import { TimeWheelPickerStateManager, type TimeWheelPickerStateManagerProps } from './TimeWheelPickerStateManager'
import {
  defaultTimeWheelMillisecondIncrement,
  defaultTimeWheelMinuteIncrement,
  defaultTimeWheelPrecision,
  defaultTimeWheelSecondIncrement,
  defaultWheelLoopingBehaviour,
  type WheelLoopingBehaviour
} from './TimeWheelPickerState'

export type TimeWheelPickerProps = Omit<TimeWheelPickerStateManagerProps, 'children'> & {
  is24HourFormat?: boolean,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  layoutRef?: Ref<ComponentRef<typeof TimeWheelPickerLayout>>,
  layoutProps?: TimeWheelPickerLayoutProps,
}

const TimeWheelPickerComponent = ({
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
  isLooping = true,
  loopingBehaviour = defaultWheelLoopingBehaviour,
  precision = defaultTimeWheelPrecision,
  minuteIncrement = defaultTimeWheelMinuteIncrement,
  secondIncrement = defaultTimeWheelSecondIncrement,
  millisecondIncrement = defaultTimeWheelMillisecondIncrement,
  layoutRef,
  layoutProps,
}: TimeWheelPickerProps) => {

  return (
    <TimeWheelPickerStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      is24HourFormat={is24HourFormat}
      isLooping={isLooping}
      loopingBehaviour={loopingBehaviour}
      precision={precision}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
    >
      <TimeWheelPickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <TimeWheelPickerWheel unit="hour" />
        <TimeWheelPickerSeparator symbol=":" />
        <TimeWheelPickerWheel unit="minute" />
        <TimeWheelPickerSeparator symbol=":" unit="second" />
        <TimeWheelPickerWheel unit="second" />
        <TimeWheelPickerSeparator symbol="." unit="millisecond" />
        <TimeWheelPickerWheel unit="millisecond" />
        <TimeWheelPickerPeriod />
      </TimeWheelPickerLayout>
    </TimeWheelPickerStateManager>
  )
}

export const TimeWheelPicker = Object.assign(TimeWheelPickerComponent, {
  StateManager: TimeWheelPickerStateManager,
  Layout: TimeWheelPickerLayout,
  Wheel: TimeWheelPickerWheel,
  Separator: TimeWheelPickerSeparator,
  Period: TimeWheelPickerPeriod,
  Context: TimeWheelPickerContext,
  Provider: TimeWheelPickerContext.Provider,
  Consumer: TimeWheelPickerContext.Consumer,
})
