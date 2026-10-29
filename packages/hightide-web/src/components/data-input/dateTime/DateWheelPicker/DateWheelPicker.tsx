import type { ComponentRef, Ref } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useBoundDateState } from '../useDateStateMachine'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import { defaultWheelLoopingBehaviour } from '../TimeWheelPicker/TimeWheelPickerState'
import { DateWheelPickerContext } from './DateWheelPickerContext'
import { DateWheelPickerDayWheel } from './DateWheelPickerDayWheel'
import { DateWheelPickerLayout, type DateWheelPickerLayoutProps } from './DateWheelPickerLayout'
import { DateWheelPickerMonthWheel } from './DateWheelPickerMonthWheel'
import { DateWheelPickerYearWheel } from './DateWheelPickerYearWheel'
import { DateWheelPickerStateManager } from './DateWheelPickerStateManager'
import type { DateWheelPickerEvent, DateWheelPickerState } from './DateWheelPickerState'

export type DateWheelPickerProps = ControllableInputProps<Date, DateWheelPickerEvent> & {
  start?: Date,
  end?: Date,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  layoutRef?: Ref<ComponentRef<typeof DateWheelPickerLayout>>,
  layoutProps?: DateWheelPickerLayoutProps,
}

const DateWheelPickerComponent = ({
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
  isLooping = true,
  loopingBehaviour = defaultWheelLoopingBehaviour,
  layoutRef,
  layoutProps,
}: DateWheelPickerProps) => {
  const binding = useBoundDateState<DateWheelPickerState>({
    value: value ?? initialValue,
  }, value, onValueChange)

  return (
    <DateWheelPickerStateManager
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
    >
      <DateWheelPickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <DateWheelPickerDayWheel />
        <DateWheelPickerMonthWheel />
        <DateWheelPickerYearWheel />
      </DateWheelPickerLayout>
    </DateWheelPickerStateManager>
  )
}

export const DateWheelPicker = Object.assign(DateWheelPickerComponent, {
  StateManager: DateWheelPickerStateManager,
  Layout: DateWheelPickerLayout,
  DayWheel: DateWheelPickerDayWheel,
  MonthWheel: DateWheelPickerMonthWheel,
  YearWheel: DateWheelPickerYearWheel,
  Context: DateWheelPickerContext,
  Provider: DateWheelPickerContext.Provider,
  Consumer: DateWheelPickerContext.Consumer,
})
