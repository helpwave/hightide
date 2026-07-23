import { useState } from 'react'
import { ArrowDown, ArrowUp, Calendar, ChevronDown } from 'lucide-react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { LocalizationUtil } from '@helpwave/hightide-utils/i18n'
import clsx from 'clsx'
import type { DayPickerProps } from './DayPicker'
import { DayPicker } from './DayPicker'
import type { YearMonthPickerProps } from './YearMonthPicker'
import { YearMonthPicker } from './YearMonthPicker'
import { useLocalization } from '../../../global-contexts/localization/forward-exports'
import { Button } from '../Button'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

type DisplayMode = 'yearMonth' | 'day'

export interface DatePickerProps extends
 Partial<FormFieldDataHandling<Date>>,
 Pick<DayPickerProps, 'markToday' | 'start' | 'end' | 'weekStart'>
 {
  initialValue?: Date,
  initialDisplay?: DisplayMode,
  dayPickerProps?: Omit<DayPickerProps, 'displayedMonth' | 'onChange' | 'selected' | 'weekStart' | 'markToday' | 'start' | 'end'>,
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
  const { locale } = useLocalization()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date(value.getFullYear(), value.getMonth(), 1))
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

  const isDayMode = displayMode === 'day'

  return (
    <div className={clsx('date-picker', className)}>
      <div className="date-picker-header">
        <Button
          size="sm"
          color="neutral"
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${new Intl.DateTimeFormat(LocalizationUtil.isoLocaleToLanguage(locale), { month: 'short' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </Button>
        <div className="flex-row-2 justify-end">
          <IconButton
            tooltip={translation('time.today')}
            size="sm"
            coloringStyle="tonal"
            disabled={!isDayMode}
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
            disabled={!isDayMode || !DateUtils.between(DateUtils.subtractDuration(displayedMonth, { months: 1 }), start, end)}
            onClick={() => {
              setDisplayedMonth(DateUtils.subtractDuration(displayedMonth, { months: 1 }))
            }}
          >
            <ArrowUp size={20}/>
          </IconButton>
          <IconButton
            tooltip={translation('time.nextMonth')}
            size="sm"
            disabled={!isDayMode || !DateUtils.between(DateUtils.addDuration(displayedMonth, { months: 1 }), start, end)}
            onClick={() => {
              setDisplayedMonth(DateUtils.addDuration(displayedMonth, { months: 1 }))
            }}
          >
            <ArrowDown size={20}/>
          </IconButton>
        </div>
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
          className="date-picker-content"
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
          className="date-picker-content"
        />
      )}
    </div>
  )
}
