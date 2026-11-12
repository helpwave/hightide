import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import { defaultWheelLoopingBehaviour } from '../TimeWheelPicker/TimeWheelPickerState'
import { DateWheelPickerContext } from './DateWheelPickerContext'
import { DateWheelPickerDayWheel } from './DateWheelPickerDayWheel'
import { DateWheelPickerLayout, type DateWheelPickerLayoutProps } from './DateWheelPickerLayout'
import { DateWheelPickerMonthWheel } from './DateWheelPickerMonthWheel'
import { DateWheelPickerYearWheel } from './DateWheelPickerYearWheel'
import { DateWheelPickerStateManager, type DateWheelPickerStateManagerProps } from './DateWheelPickerStateManager'

export type DateWheelPickerProps = Omit<DateWheelPickerStateManagerProps, 'children'> & {
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
  id,
  start,
  end,
  isLooping = true,
  loopingBehaviour = defaultWheelLoopingBehaviour,
  layoutRef,
  layoutProps,
}: DateWheelPickerProps) => {

  return (
    <DateWheelPickerStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
