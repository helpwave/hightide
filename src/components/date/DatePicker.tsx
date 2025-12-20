import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Calendar, ChevronDown } from 'lucide-react'
import { addDuration, isInTimeSpan, subtractDuration } from '@/src/utils/date'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { DayPickerProps } from '@/src/components/date/DayPicker'
import { DayPicker } from '@/src/components/date/DayPicker'
import type { YearMonthPickerProps } from '@/src/components/date/YearMonthPicker'
import { YearMonthPicker } from '@/src/components/date/YearMonthPicker'
import { useLocale } from '@/src/contexts/LocaleContext'
import { Button } from '@/src/components/user-action/Button'
import { LocalizationUtil } from '@/src/i18n/util'

type DisplayMode = 'yearMonth' | 'day'

export type DatePickerProps = {
  value?: Date,
  start?: Date,
  end?: Date,
  initialDisplay?: DisplayMode,
  onChange?: (date: Date) => void,
  dayPickerProps?: Omit<DayPickerProps, 'displayedMonth' | 'onChange' | 'selected'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'displayedYearMonth' | 'onChange' | 'start' | 'end'>,
  className?: string,
}

/**
 * A Component for picking a date
 */
export const DatePicker = ({
                             value = new Date(),
                             start = subtractDuration(new Date(), { years: 50 }),
                             end = addDuration(new Date(), { years: 50 }),
                             initialDisplay = 'day',
                             onChange,
                             yearMonthPickerProps,
                             dayPickerProps,
                             className = ''
                           }: DatePickerProps) => {
  const { locale } = useLocale()
  const [displayedMonth, setDisplayedMonth] = useState<Date>(value)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

  useEffect(() => {
    setDisplayedMonth(value)
  }, [value])

  return (
    <div className={clsx('flex-col-3', className)}>
      <div className="flex-row-2 items-center justify-between">
        <Button
          size="sm"
          coloringStyle="text"
          className={clsx('flex-row-1 items-center cursor-pointer select-none', {
            'text-disabled': displayMode !== 'day',
          })}
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${new Intl.DateTimeFormat(LocalizationUtil.localToLanguage(locale), { month: 'long' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </Button>
        {displayMode === 'day' && (
          <div className="flex-row-2 justify-end">
            <Button
              size="sm"
              coloringStyle="tonal"
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                onChange(newDate)
              }}
            >
              <Calendar className="size-5"/>
            </Button>
            <Button
              size="sm"
              disabled={!isInTimeSpan(subtractDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowUp size={20}/>
            </Button>
            <Button
              size="sm"
              disabled={!isInTimeSpan(addDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowDown size={20}/>
            </Button>
          </div>
        )}
      </div>
      {displayMode === 'yearMonth' ? (
        <YearMonthPicker
          {...yearMonthPickerProps}
          displayedYearMonth={value}
          start={start}
          end={end}
          onChange={newDate => {
            setDisplayedMonth(newDate)
            setDisplayMode('day')
          }}
        />
      ) : (
        <DayPicker
          {...dayPickerProps}
          displayedMonth={displayedMonth}
          start={start}
          end={end}
          selected={value}
          onChange={date => {
            onChange?.(date)
          }}
        />
      )}
    </div>
  )
}

/**
 * Example for the Date Picker
 */
export const DatePickerUncontrolled = ({
                                         value,
                                         onChange,
                                         ...props
                                       }: DatePickerProps) => {
  const [date, setDate] = useOverwritableState<Date>(value, onChange)

  return (
    <DatePicker
      {...props}
      value={date}
      onChange={setDate}
    />
  )
}
