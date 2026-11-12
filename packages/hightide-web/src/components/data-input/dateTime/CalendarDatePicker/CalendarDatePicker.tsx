import type { ComponentRef, Ref } from 'react'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CalendarDatePickerContext } from './CalendarDatePickerContext'
import { CalendarDatePickerBody, type CalendarDatePickerBodyProps } from './CalendarDatePickerBody'
import { CalendarDatePickerHeader, type CalendarDatePickerHeaderProps } from './CalendarDatePickerHeader'
import { CalendarDatePickerLayout, type CalendarDatePickerLayoutProps } from './CalendarDatePickerLayout'
import type { CalendarDayPickerLayout, CalendarDayPickerLayoutProps } from '../CalendarDayPicker'
import type { YearMonthPickerLayout, YearMonthPickerLayoutProps } from '../YearMonthPicker'
import { CalendarDatePickerStateManager, type CalendarDatePickerStateManagerProps } from './CalendarDatePickerStateManager'
import { type CalendarDisplayMode } from './CalendarDatePickerState'

export type CalendarDatePickerProps = Omit<CalendarDatePickerStateManagerProps, 'children'> & {
  initialDisplay?: CalendarDisplayMode,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  layoutRef?: Ref<ComponentRef<typeof CalendarDatePickerLayout>>,
  layoutProps?: CalendarDatePickerLayoutProps,
  headerRef?: Ref<ComponentRef<typeof CalendarDatePickerHeader>>,
  headerProps?: CalendarDatePickerHeaderProps,
  bodyProps?: CalendarDatePickerBodyProps,
  yearMonthPickerRef?: Ref<ComponentRef<typeof YearMonthPickerLayout>>,
  yearMonthPickerProps?: YearMonthPickerLayoutProps,
  calendarDayPickerRef?: Ref<ComponentRef<typeof CalendarDayPickerLayout>>,
  calendarDayPickerProps?: CalendarDayPickerLayoutProps,
}

const CalendarDatePickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  initialDisplay = 'day',
  start,
  end,
  weekStart,
  markToday,
  layoutRef,
  layoutProps,
  headerRef,
  headerProps,
  bodyProps,
  yearMonthPickerRef,
  yearMonthPickerProps,
  calendarDayPickerRef,
  calendarDayPickerProps,
}: CalendarDatePickerProps) => {
  return (
    <CalendarDatePickerStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      initialDisplay={initialDisplay}
      start={start}
      end={end}
      weekStart={weekStart}
      markToday={markToday}
    >
      <CalendarDatePickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <CalendarDatePickerHeader
          ref={ReactUtils.assingRefsBuilder([headerRef])}
          hasTime={bodyProps?.time !== undefined}
          {...headerProps}
        />
        <CalendarDatePickerBody
          yearMonthPickerRef={yearMonthPickerRef}
          yearMonthPickerProps={yearMonthPickerProps}
          calendarDayPickerRef={calendarDayPickerRef}
          calendarDayPickerProps={calendarDayPickerProps}
          {...bodyProps}
        />
      </CalendarDatePickerLayout>
    </CalendarDatePickerStateManager>
  )
}

export const CalendarDatePicker = Object.assign(CalendarDatePickerComponent, {
  StateManager: CalendarDatePickerStateManager,
  Layout: CalendarDatePickerLayout,
  Header: CalendarDatePickerHeader,
  Body: CalendarDatePickerBody,
  Context: CalendarDatePickerContext,
  Provider: CalendarDatePickerContext.Provider,
  Consumer: CalendarDatePickerContext.Consumer,
})
