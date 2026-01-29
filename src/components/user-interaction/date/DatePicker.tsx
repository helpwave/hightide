import { useState } from 'react'
import { ArrowDown, ArrowUp, Calendar, ChevronDown } from 'lucide-react'
import type { WeekDay } from '@/src/utils/date'
import { addDuration, isInTimeSpan, subtractDuration } from '@/src/utils/date'
import clsx from 'clsx'
import type { DayPickerProps } from '@/src/components/user-interaction/date/DayPicker'
import { DayPicker } from '@/src/components/user-interaction/date/DayPicker'
import type { YearMonthPickerProps } from '@/src/components/user-interaction/date/YearMonthPicker'
import { YearMonthPicker } from '@/src/components/user-interaction/date/YearMonthPicker'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { Button } from '@/src/components/user-interaction/Button'
import { LocalizationUtil } from '@/src/i18n/util'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

type DisplayMode = 'yearMonth' | 'day'

export type DatePickerProps = Partial<FormFieldDataHandling<Date>> & {
  initialValue?: Date,
  start?: Date,
  end?: Date,
  initialDisplay?: DisplayMode,
  weekStart?: WeekDay,
  dayPickerProps?: Omit<DayPickerProps, 'displayedMonth' | 'onChange' | 'selected' | 'weekStart'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'displayedYearMonth' | 'onChange' | 'start' | 'end'>,
  className?: string,
}

/**
 * A Component for picking a date
 */
export const DatePicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start,
  end,
  initialDisplay = 'day',
  weekStart,
  onValueChange,
  onEditComplete,
  yearMonthPickerProps,
  dayPickerProps,
  className
}: DatePickerProps) => {
  const translation = useHightideTranslation()
  const { locale } = useLocale()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date(value.getFullYear(), value.getMonth(), 1))
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

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
            <IconButton
              tooltip={translation('time.today')}
              size="sm"
              coloringStyle="tonal"
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                setValue(newDate)
                setDisplayedMonth(newDate)
              }}
            >
              <Calendar className="size-5"/>
            </IconButton>
            <IconButton
              tooltip={translation('time.previousMonth')}
              size="sm"
              disabled={!isInTimeSpan(subtractDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowUp size={20}/>
            </IconButton>
            <IconButton
              tooltip={translation('time.nextMonth')}
              size="sm"
              disabled={!isInTimeSpan(addDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowDown size={20}/>
            </IconButton>
          </div>
        )}
      </div>
      {displayMode === 'yearMonth' ? (
        <YearMonthPicker
          {...yearMonthPickerProps}
          value={value}
          start={start}
          end={end}
          onValueChange={newDate => {
            setDisplayedMonth(newDate)
            setDisplayMode('day')
          }}
          onEditComplete={newDate => {
            setDisplayedMonth(newDate)
            setDisplayMode('day')
          }}
          className="h-60 max-h-60"
        />
      ) : (
        <DayPicker
          {...dayPickerProps}
          value={value}
          displayedMonth={displayedMonth}
          changeDisplayedMonth={setDisplayedMonth}
          start={start}
          end={end}
          weekStart={weekStart}
          onValueChange={setValue}
          onEditComplete={onEditComplete}
          className="h-60 max-h-60"
        />
      )}
    </div>
  )
}
