import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import { addDuration, isInTimeSpan, subtractDuration } from '@/src/utils/date'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { TimeTranslationType } from '@/src/localization/defaults/time'
import { timeTranslation } from '@/src/localization/defaults/time'
import type { DayPickerProps } from '@/src/components/date/DayPicker'
import { DayPicker } from '@/src/components/date/DayPicker'
import type { YearMonthPickerProps } from '@/src/components/date/YearMonthPicker'
import { YearMonthPicker } from '@/src/components/date/YearMonthPicker'
import type { PropsForTranslation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'
import { useLocale } from '@/src/localization/LanguageProvider'
import { SolidButton, TextButton } from '@/src/components/user-action/Button'

type DatePickerTranslationType = TimeTranslationType

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
                             overwriteTranslation,
                             value = new Date(),
                             start = subtractDuration(new Date(), { years: 50 }),
                             end = addDuration(new Date(), { years: 50 }),
                             initialDisplay = 'day',
                             onChange,
                             yearMonthPickerProps,
                             dayPickerProps,
                             className = ''
                           }: PropsForTranslation<DatePickerTranslationType, DatePickerProps>) => {
  const locale = useLocale()
  const translation = useTranslation([timeTranslation], overwriteTranslation)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(value)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

  useEffect(() => {
    setDisplayedMonth(value)
  }, [value])

  return (
    <div className={clsx('flex-col-4', className)}>
      <div className="flex-row-2 items-center justify-between h-7">
        <TextButton
          className={clsx('flex-row-1 items-center cursor-pointer select-none', {
            'text-disabled': displayMode !== 'day',
          })}
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${new Intl.DateTimeFormat(locale, { month: 'long' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </TextButton>
        {displayMode === 'day' && (
          <div className="flex-row-2 justify-end">
            <SolidButton
              size="small"
              color="primary"
              disabled={!isInTimeSpan(subtractDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowUp size={20}/>
            </SolidButton>
            <SolidButton
              size="small"
              color="primary"
              disabled={!isInTimeSpan(addDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowDown size={20}/>
            </SolidButton>
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
        <div>
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
          <div className="mt-2">
            <TextButton
              color="primary"
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                onChange(newDate)
              }}
            >
              {translation('today')}
            </TextButton>
          </div>
        </div>
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
