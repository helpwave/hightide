import type { WeekDay } from '../../util/date'
import { equalDate, getWeeksForCalenderMonth, isInTimeSpan } from '../../util/date'
import { noop } from '../../util/noop'
import clsx from 'clsx'
import { useLocale } from '../../localization/LanguageProvider'
import { useEffect, useState } from 'react'

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
                            onChange = noop,
                            weekStart = 'monday',
                            markToday = true,
                            className = ''
                          }: DayPickerProps) => {
  const locale = useLocale()
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
            const isSelected = !!selected && equalDate(selected, date)
            const isToday = equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            const isDayValid = isInTimeSpan(date, start, end)
            return (
              <button
                disabled={!isDayValid}
                key={date.getDate()}
                className={clsx(
                  'flex-1 rounded-full border-2',
                  {
                    'text-description': !isSameMonth && !isSelected && isDayValid,
                    'text-button-solid-neutral-text bg-button-solid-neutral-background': !isSelected && isSameMonth && isDayValid,
                    'text-button-solid-primary-text bg-button-solid-primary-background': isSelected && isDayValid,
                    'hover:brightness-90 hover:bg-button-solid-primary-background hover:text-button-solid-primary-text': isDayValid,
                    'text-disabled-text bg-disabled-background cursor-not-allowed': !isDayValid,
                    'border-secondary': isToday && markToday,
                    'border-transparent': !isToday || !markToday,
                  }
                )}
                onClick={() => onChange(date)}
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
                                        displayedMonth,
                                        selected,
                                        onChange = noop,
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
        onChange(newDate)
      }}
      {...restProps}
    />
  )
}
