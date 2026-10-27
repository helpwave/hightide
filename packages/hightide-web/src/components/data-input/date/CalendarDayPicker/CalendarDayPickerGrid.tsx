import type { KeyboardEvent } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useCalendarDayPickerContext } from './CalendarDayPickerContext'
import { CalendarDayPickerTrigger } from './CalendarDayPickerTrigger'

export function CalendarDayPickerGrid() {
  const { state, dispatch, config } = useCalendarDayPickerContext()
  const selectedRef = useRef<HTMLDivElement>(null)
  const weeks = DateUtils.weeksForCalenderMonth(state.displayedMonth, config.weekStart)
  const isValueInDisplayedWeeks = useMemo(
    () => weeks.some((week) => week.some((day) => DateUtils.equalDate(state.value, day))),
    [state.value, weeks]
  )
  const focusTargetDate = isValueInDisplayedWeeks
    ? state.value
    : new Date(state.displayedMonth.getFullYear(), state.displayedMonth.getMonth(), 1)
  const focusTime = focusTargetDate.getTime()
  const isLocked = config.isDisabled || config.isReadOnly

  useEffect(() => {
    selectedRef.current?.focus()
  }, [focusTime])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    PropsUtil.aria.navigate<HTMLDivElement>({
      left: () => dispatch({ type: 'moveTo', date: DateUtils.subtractDuration(focusTargetDate, { days: 1 }) }),
      right: () => dispatch({ type: 'moveTo', date: DateUtils.addDuration(focusTargetDate, { days: 1 }) }),
      up: () => dispatch({ type: 'moveTo', date: DateUtils.subtractDuration(focusTargetDate, { days: 7 }) }),
      down: () => dispatch({ type: 'moveTo', date: DateUtils.addDuration(focusTargetDate, { days: 7 }) }),
    })(event)
  }

  return (
    <>
      {weeks.map((week, index) => (
        <div key={index} className="calendar-day-picker-body-row">
          {week.map((date) => {
            const isSelected = DateUtils.equalDate(state.value, date)
            const isFocused = DateUtils.equalDate(focusTargetDate, date)
            const isToday = DateUtils.equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === state.displayedMonth.getMonth()
            const isDayValid = DateUtils.between(date, config.start, config.end) && !isLocked
            return (
              <CalendarDayPickerTrigger
                key={date.getTime()}
                date={date}
                isSelected={isSelected}
                isFocused={isFocused}
                isToday={isToday}
                isSameMonth={isSameMonth}
                isDayValid={isDayValid}
                markToday={config.markToday}
                selectedRef={selectedRef}
                onKeyDown={onKeyDown}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}
