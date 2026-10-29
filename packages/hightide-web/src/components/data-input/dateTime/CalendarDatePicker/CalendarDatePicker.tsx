import type { ComponentRef, Ref } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useCallback } from 'react'
import { CalendarDatePickerContext } from './CalendarDatePickerContext'
import { CalendarDatePickerBody, type CalendarDatePickerBodyProps } from './CalendarDatePickerBody'
import { CalendarDatePickerHeader, type CalendarDatePickerHeaderProps } from './CalendarDatePickerHeader'
import { CalendarDatePickerLayout, type CalendarDatePickerLayoutProps } from './CalendarDatePickerLayout'
import type { CalendarDayPickerLayout, CalendarDayPickerLayoutProps } from '../CalendarDayPicker'
import type { YearMonthPickerLayout, YearMonthPickerLayoutProps } from '../YearMonthPicker'
import { CalendarDatePickerStateManager } from './CalendarDatePickerStateManager'
import type {
  CalendarDatePickerEvent,
  CalendarDatePickerState,
  CalendarDisplayMode
} from './CalendarDatePickerState'

export type CalendarDatePickerProps = ControllableInputProps<Date, CalendarDatePickerEvent> & {
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
  const [state, setState] = useControlledState<CalendarDatePickerState>({
    defaultValue: {
      value: value ?? initialValue,
      displayedMonth: new Date((value ?? initialValue).getFullYear(), (value ?? initialValue).getMonth(), 1),
      displayMode: initialDisplay,
    },
  })
  const binding = useStateMachineBinding<CalendarDatePickerState, Date>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: Date) => ({ value: next }), []),
    get: useCallback((current: CalendarDatePickerState) => current.value, []),
  })

  return (
    <CalendarDatePickerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
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
