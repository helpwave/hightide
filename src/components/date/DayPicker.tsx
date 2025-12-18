import type { WeekDay } from '@/src/utils/date'
import { DateUtils, getWeeksForCalenderMonth, isInTimeSpan } from '@/src/utils/date'
import clsx from 'clsx'
import { useLocale } from '@/src/i18n/LocaleProvider'
import { useEffect, useState } from 'react'
import { Button } from '@/src/components/user-action/Button'

export type DayPickerProps = {
  displayedMonth: Date,
  selected?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  weekStart?: WeekDay,
  markToday?: boolean,
  className?: string,
}

/**
 * A component for selecting a day of a month
 */
export const DayPicker = ({
                            displayedMonth,
                            selected,
                            start,
                            end,
                            onChange,
                            weekStart = 'monday',
                            markToday = true,
                            className = ''
                          }: DayPickerProps) => {
  const { locale } = useLocale()
  const month = displayedMonth.getMonth()
  const weeks = getWeeksForCalenderMonth(displayedMonth, weekStart)

  return (
    <div className={clsx('flex-col-1 min-w-[220px] select-none', className)}>
      <div className="flex-row-2 text-center">
        {weeks[0]!.map((weekDay, index) => (
          <div key={index} className="flex-1 font-semibold">
            {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className="flex-row-2 text-center">
          {week.map((date) => {
            const isSelected = !!selected && DateUtils.equalDate(selected, date)
            const isToday = DateUtils.equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            const isDayValid = isInTimeSpan(date, start, end)
            return (
              <Button
                disabled={!isDayValid}
                key={date.getDate()}
                color={isSelected ? 'primary' : 'neutral'}
                coloringStyle={isSelected ? 'solid' : 'text'}
                size="small"
                className={clsx(
                  'flex-1 rounded-full border-2',
                  {
                    'text-description': !isSameMonth && !isSelected && isDayValid,
                    'border-on-background': isToday && markToday,
                    'border-transparent': !(isToday && markToday),
                  }
                )}
                onClick={() => onChange?.(new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  selected.getHours(),
                  selected.getMinutes(),
                  selected.getSeconds()
                ))}
              >
                {date.getDate()}
              </Button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const DayPickerUncontrolled = ({
                                        displayedMonth,
                                        selected,
                                        onChange,
                                        ...restProps
                                      }: DayPickerProps) => {
  const [date, setDate] = useState(selected)
  const [usedDisplayedMonth, setUsedDDisplayedMonth] = useState(displayedMonth)

  useEffect(() => {
    setDate(selected)
    setUsedDDisplayedMonth(selected)
  }, [selected])

  return (
    <DayPicker
      displayedMonth={usedDisplayedMonth}
      selected={date}
      onChange={newDate => {
        setDate(newDate)
        setUsedDDisplayedMonth(newDate)
        onChange?.(newDate)
      }}
      {...restProps}
    />
  )
}
