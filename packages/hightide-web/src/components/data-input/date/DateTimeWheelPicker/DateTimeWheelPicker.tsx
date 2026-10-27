import type { ComponentRef, Ref } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import type { DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useBoundDateState } from '../useDateStateMachine'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import type { DateWheelPickerLayout, DateWheelPickerLayoutProps } from '../DateWheelPicker'
import type { TimeWheelPickerLayout, TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { DateTimeWheelPickerContext } from './DateTimeWheelPickerContext'
import { DateTimeWheelPickerLayout, type DateTimeWheelPickerLayoutProps } from './DateTimeWheelPickerLayout'
import { DateTimeWheelPickerWheels } from './DateTimeWheelPickerWheels'
import { DateTimeWheelPickerStateManager } from './DateTimeWheelPickerStateManager'
import type { DateTimeWheelPickerEvent, DateTimeWheelPickerState } from './DateTimeWheelPickerState'

export type DateTimeWheelPickerProps = ControllableInputProps<Date, DateTimeWheelPickerEvent> & {
  start?: Date,
  end?: Date,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
  layoutRef?: Ref<ComponentRef<typeof DateTimeWheelPickerLayout>>,
  layoutProps?: DateTimeWheelPickerLayoutProps,
  dateWheelPickerRef?: Ref<ComponentRef<typeof DateWheelPickerLayout>>,
  dateWheelPickerProps?: DateWheelPickerLayoutProps,
  timeWheelPickerRef?: Ref<ComponentRef<typeof TimeWheelPickerLayout>>,
  timeWheelPickerProps?: TimeWheelPickerLayoutProps,
}

const DateTimeWheelPickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  start,
  end,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  layoutRef,
  layoutProps,
  dateWheelPickerRef,
  dateWheelPickerProps,
  timeWheelPickerRef,
  timeWheelPickerProps,
}: DateTimeWheelPickerProps) => {
  const binding = useBoundDateState<DateTimeWheelPickerState>({
    value: value ?? initialValue,
  }, value, onValueChange)

  return (
    <DateTimeWheelPickerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      start={start}
      end={end}
      isLooping={isLooping}
      loopingBehaviour={loopingBehaviour}
      is24HourFormat={is24HourFormat}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
      precision={precision}
    >
      <DateTimeWheelPickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <DateTimeWheelPickerWheels
          dateWheelPickerRef={dateWheelPickerRef}
          dateWheelPickerProps={dateWheelPickerProps}
          timeWheelPickerRef={timeWheelPickerRef}
          timeWheelPickerProps={timeWheelPickerProps}
        />
      </DateTimeWheelPickerLayout>
    </DateTimeWheelPickerStateManager>
  )
}

export const DateTimeWheelPicker = Object.assign(DateTimeWheelPickerComponent, {
  StateManager: DateTimeWheelPickerStateManager,
  Layout: DateTimeWheelPickerLayout,
  Wheels: DateTimeWheelPickerWheels,
  Context: DateTimeWheelPickerContext,
  Provider: DateTimeWheelPickerContext.Provider,
  Consumer: DateTimeWheelPickerContext.Consumer,
})
