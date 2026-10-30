import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useBoundDateState } from '../useDateStateMachine'
import type { CalendarDatePickerLayout, CalendarDatePickerLayoutProps, CalendarDisplayMode } from '../CalendarDatePicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import type { TimeWheelPickerLayout, TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { DateTimePickerContext } from './DateTimePickerContext'
import { DateTimePickerCalendar } from './DateTimePickerCalendar'
import { DateTimePickerContent } from './DateTimePickerContent'
import { DateTimePickerLayout, type DateTimePickerLayoutProps } from './DateTimePickerLayout'
import { DateTimePickerTime } from './DateTimePickerTime'
import { DateTimePickerStateManager } from './DateTimePickerStateManager'
import type { DateTimePickerEvent, DateTimePickerState } from './DateTimePickerState'

export type DateTimePickerProps = ControllableDOMInputProps<Date, DateTimePickerEvent> & {
  mode?: DateTimeFormat,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
  initialDisplay?: CalendarDisplayMode,
  layoutRef?: Ref<ComponentRef<typeof DateTimePickerLayout>>,
  layoutProps?: DateTimePickerLayoutProps,
  calendarRef?: Ref<ComponentRef<typeof CalendarDatePickerLayout>>,
  calendarProps?: CalendarDatePickerLayoutProps,
  timeRef?: Ref<ComponentRef<typeof TimeWheelPickerLayout>>,
  timeProps?: TimeWheelPickerLayoutProps,
}

const DateTimePickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  mode,
  start,
  end,
  weekStart,
  markToday,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  initialDisplay,
  layoutRef,
  layoutProps,
  calendarRef,
  calendarProps,
  timeRef,
  timeProps,
}: DateTimePickerProps) => {
  const binding = useBoundDateState<DateTimePickerState>({
    value: value ?? initialValue,
  }, value, onValueChange)

  return (
    <DateTimePickerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      mode={mode}
      start={start}
      end={end}
      weekStart={weekStart}
      markToday={markToday}
      is24HourFormat={is24HourFormat}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
      precision={precision}
      initialDisplay={initialDisplay}
    >
      <DateTimePickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <DateTimePickerContent
          calendarRef={calendarRef}
          calendarProps={calendarProps}
          timeRef={timeRef}
          timeProps={timeProps}
        />
      </DateTimePickerLayout>
    </DateTimePickerStateManager>
  )
}

export const DateTimePicker = Object.assign(DateTimePickerComponent, {
  StateManager: DateTimePickerStateManager,
  Layout: DateTimePickerLayout,
  Content: DateTimePickerContent,
  Calendar: DateTimePickerCalendar,
  Time: DateTimePickerTime,
  Context: DateTimePickerContext,
  Provider: DateTimePickerContext.Provider,
  Consumer: DateTimePickerContext.Consumer,
})
