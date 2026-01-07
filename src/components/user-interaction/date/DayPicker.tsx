import type { WeekDay } from '@/src/utils/date'
import { DateUtils, getWeeksForCalenderMonth, isInTimeSpan } from '@/src/utils/date'
import { useLocale } from '@/src/contexts/LocaleContext'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useMemo } from 'react'

export type DayPickerProps = Partial<FormFieldDataHandling<Date>> & {
  displayedMonth: Date,
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
  displayedMonth,
  value,
  start: providedStart,
  end: providedEnd,
  onValueChange,
  onEditComplete,
  weekStart = 'monday',
  markToday = true,
  className = ''
}: DayPickerProps) => {
  const { locale } = useLocale()
  const month = displayedMonth.getMonth()
  const weeks = getWeeksForCalenderMonth(displayedMonth, weekStart)

  // TODO add keyboard navigation here

  const end = useMemo(() => {
    if(!providedEnd) return
    return new Date(providedEnd.getFullYear(), providedEnd.getMonth(), providedEnd.getDate())
  }, [providedEnd])

  const start = useMemo(() => {
    if(!providedStart) return
    return new Date(providedStart.getFullYear(), providedStart.getMonth(), providedStart.getDate())
  }, [providedStart])

  return (
    <div className={className} data-name="day-picker-container">
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
            const isToday = DateUtils.equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            const isDayValid = isInTimeSpan(date, start, end)
            return (
              <button
                key={date.getDate()}

                disabled={!isDayValid}

                onClick={() => {
                  const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    value.getHours(),
                    value.getMinutes(),
                    value.getSeconds()
                  )
                  onValueChange?.(newDate)
                  onEditComplete?.(newDate)
                }}

                data-name="day-picker-body-item"
                data-selected={PropsUtil.dataAttributes.bool(isSelected)}
                data-invalid={PropsUtil.dataAttributes.bool(!isDayValid)}
                data-today={PropsUtil.dataAttributes.bool(isToday && markToday)}
                data-samemonth={PropsUtil.dataAttributes.bool(isSameMonth)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const DayPickerUncontrolled = ({
  value: initialValue,
  onValueChange,
  ...props
}: DayPickerProps) => {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <DayPicker
      value={value}
      onValueChange={setValue}
      {...props}
    />
  )
}
