import clsx from 'clsx'
import type { ComponentRef, ReactNode, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CalendarDayPicker, type CalendarDayPickerLayoutProps } from '../CalendarDayPicker'
import { YearMonthPicker, type YearMonthPickerLayoutProps } from '../YearMonthPicker'
import { useCalendarDatePickerContext } from './CalendarDatePickerContext'

export type CalendarDatePickerBodyProps = {
  time?: ReactNode,
  yearMonthPickerRef?: Ref<ComponentRef<typeof YearMonthPicker.Layout>>,
  yearMonthPickerProps?: YearMonthPickerLayoutProps,
  calendarDayPickerRef?: Ref<ComponentRef<typeof CalendarDayPicker.Layout>>,
  calendarDayPickerProps?: CalendarDayPickerLayoutProps,
}

export function CalendarDatePickerBody({
  time,
  yearMonthPickerRef,
  yearMonthPickerProps,
  calendarDayPickerRef,
  calendarDayPickerProps,
}: CalendarDatePickerBodyProps) {
  const { state, dispatch, config } = useCalendarDatePickerContext()
  const isYearMonthShown = state.displayMode === 'yearMonth'
  const isDayShown = state.displayMode === 'day'
  const isTimeShown = state.displayMode === 'time'

  return (
    <>
      <YearMonthPicker.StateManager
        state={{ value: state.value }}
        onStateChange={(next) => dispatch({ type: 'pickYearMonth', value: next.value })}
        isInvalid={config.isInvalid}
        isDisabled={config.isDisabled}
        isReadOnly={config.isReadOnly}
        isRequired={config.isRequired}
        start={config.start}
        end={config.end}
      >
        <YearMonthPicker.Layout
          {...yearMonthPickerProps}
          ref={ReactUtils.assingRefsBuilder([yearMonthPickerRef])}
          className={clsx('calendar-date-picker-content', yearMonthPickerProps?.className)}
          hidden={!isYearMonthShown}
          aria-hidden={!isYearMonthShown}
        >
          <YearMonthPicker.MonthWheel />
          <YearMonthPicker.YearWheel />
        </YearMonthPicker.Layout>
      </YearMonthPicker.StateManager>
      <div
        className="calendar-date-picker-content calendar-date-picker-time"
        hidden={!isTimeShown}
        aria-hidden={!isTimeShown}
      >
        {time}
      </div>
      <CalendarDayPicker.StateManager
        state={{ value: state.value, displayedMonth: state.displayedMonth }}
        onStateChange={(next) => dispatch({
          type: 'setDayState',
          value: next.value,
          displayedMonth: next.displayedMonth,
        })}
        isInvalid={config.isInvalid}
        isDisabled={config.isDisabled}
        isReadOnly={config.isReadOnly}
        isRequired={config.isRequired}
        start={config.start}
        end={config.end}
        weekStart={config.weekStart}
        markToday={config.markToday}
      >
        <CalendarDayPicker.Layout
          {...calendarDayPickerProps}
          ref={ReactUtils.assingRefsBuilder([calendarDayPickerRef])}
          className={clsx('calendar-date-picker-content', calendarDayPickerProps?.className)}
          hidden={!isDayShown}
          aria-hidden={!isDayShown}
        >
          <CalendarDayPicker.Header />
          <CalendarDayPicker.Grid />
        </CalendarDayPicker.Layout>
      </CalendarDayPicker.StateManager>
    </>
  )
}
