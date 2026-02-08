import type { KeyboardEvent } from 'react'
import type { WeekDay } from '@/src/utils/date'
import { DateUtils, getWeeksForCalenderMonth, isInTimeSpan, addDuration, subtractDuration } from '@/src/utils/date'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import type { FormFieldDataHandling } from '../../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useControlledState } from '@/src/hooks/useControlledState'

export type DayPickerProps = Partial<FormFieldDataHandling<Date>> & {
  initialValue?: Date,
  displayedMonth?: Date,
  changeDisplayedMonth?: (date: Date) => void,
  initialDisplayedMonth?: Date,
  start?: Date,
  end?: Date,
  weekStart?: WeekDay,
  markToday?: boolean,
  className?: string,
}

/**
 * A component for selecting a day of a month
 */
export const DayPicker = ({
  displayedMonth: controlledDisplayedMonth,
  initialDisplayedMonth,
  changeDisplayedMonth,
  value: controlledValue,
  initialValue = new Date(),
  start: providedStart,
  end: providedEnd,
  onValueChange,
  onEditComplete,
  weekStart = 'monday',
  markToday = true,
  className,
}: DayPickerProps) => {
  const { locale } = useLocale()

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const [displayedMonth, setDisplayedMonth] = useControlledState({
    value: controlledDisplayedMonth,
    onValueChange: changeDisplayedMonth,
    defaultValue: initialDisplayedMonth ?? value,
  })

  const month = displayedMonth.getMonth()
  const weeks = getWeeksForCalenderMonth(displayedMonth, weekStart)
  const selectedButtonRef = useRef<HTMLDivElement>(null)

  const isValueInDisplayedWeeks = useMemo(
    () => !!value && weeks.some(week => week.some(d => DateUtils.equalDate(value, d))),
    [value, weeks]
  )

  const firstDayOfMonth = useCallback((date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1),
  [])

  const focusTargetDate = (value && isValueInDisplayedWeeks) ? value : firstDayOfMonth(displayedMonth)

  useEffect(() => {
    selectedButtonRef.current?.focus()
  }, [focusTargetDate])

  const end = useMemo(() => {
    if(!providedEnd) return
    return new Date(providedEnd.getFullYear(), providedEnd.getMonth(), providedEnd.getDate())
  }, [providedEnd])

  const start = useMemo(() => {
    if(!providedStart) return
    return new Date(providedStart.getFullYear(), providedStart.getMonth(), providedStart.getDate())
  }, [providedStart])

  const clampToRange = useCallback((date: Date) => {
    if (start && date < start) return start
    if (end && date > end) return end
    return date
  }, [start, end])



  const navigateTo = useCallback((candidate: Date) => {
    const clamped = clampToRange(candidate)
    if (!isInTimeSpan(clamped, start, end)) return
    setValue(clamped)
    onEditComplete?.(clamped)
    if (clamped.getMonth() !== displayedMonth.getMonth() || clamped.getFullYear() !== displayedMonth.getFullYear()) {
      setDisplayedMonth(firstDayOfMonth(clamped))
    }
  }, [clampToRange, start, end, setValue, onEditComplete, displayedMonth, setDisplayedMonth, firstDayOfMonth])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      PropsUtil.aria.navigate<HTMLDivElement>({
        left: () => focusTargetDate && navigateTo(subtractDuration(focusTargetDate, { days: 1 })),
        right: () => focusTargetDate && navigateTo(addDuration(focusTargetDate, { days: 1 })),
        up: () => focusTargetDate && navigateTo(subtractDuration(focusTargetDate, { days: 7 })),
        down: () => focusTargetDate && navigateTo(addDuration(focusTargetDate, { days: 7 })),
      })(event)
    },
    [focusTargetDate, navigateTo]
  )


  return (
    <div data-name="day-picker-container" className={className}>
      <div data-name="day-picker-header-row">
        {weeks[0]!.map((weekDay, index) => (
          <div key={index} data-name="day-picker-header-item">
            {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} data-name="day-picker-body-row">
          {week.map((date) => {
            const isSelected = !!value && DateUtils.equalDate(value, date)
            const isFocused = !!focusTargetDate && DateUtils.equalDate(focusTargetDate, date)
            const isToday = DateUtils.equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            const isDayValid = isInTimeSpan(date, start, end)
            return (
              <div
                key={date.getDate()}
                ref={isFocused ? selectedButtonRef : undefined}
                data-name="day-picker-body-item"
                onClick={() => {
                  if (!isDayValid) return
                  const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    value.getHours(),
                    value.getMinutes(),
                    value.getSeconds()
                  )
                  setValue(newDate)
                  onEditComplete?.(newDate)
                  if (newDate.getMonth() !== month) {
                    setDisplayedMonth(firstDayOfMonth(newDate))
                  }
                }}
                onKeyDown={onKeyDown}

                role="button"
                tabIndex={isFocused ? 0 : -1}

                data-selected={PropsUtil.dataAttributes.bool(isSelected)}
                data-invalid={PropsUtil.dataAttributes.bool(!isDayValid)}
                data-today={PropsUtil.dataAttributes.bool(isToday && markToday)}
                data-samemonth={PropsUtil.dataAttributes.bool(isSameMonth)}
              >
                {date.getDate()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

