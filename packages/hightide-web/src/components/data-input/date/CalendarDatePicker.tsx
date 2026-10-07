import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Calendar, ChevronDown } from 'lucide-react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { LocalizationUtil } from '@helpwave/hightide-utils/i18n'
import clsx from 'clsx'
import type { CalendarDayPickerProps } from './CalendarDayPicker'
import { CalendarDayPicker } from './CalendarDayPicker'
import type { YearMonthPickerProps } from './YearMonthPicker'
import { YearMonthPicker } from './YearMonthPicker'
import { useLocalization } from '../../../global-contexts/localization/forward-exports'
import { Button } from '../../interaction/Button'
import type { InputComponentInterface } from '../input/Input'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { IconButton } from '../../interaction/IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

type DisplayMode = 'yearMonth' | 'day' | 'time'

export interface CalendarDatePickerProps extends
 InputComponentInterface<Date>,
 Pick<CalendarDayPickerProps, 'markToday' | 'start' | 'end' | 'weekStart'>
 {
  initialDisplay?: DisplayMode,
  calendarDayPickerProps?: Omit<CalendarDayPickerProps, 'displayedMonth' | 'onChange' | 'selected' | 'weekStart' | 'markToday' | 'start' | 'end'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'displayedYearMonth' | 'onChange' | 'start' | 'end'>,
  timeLabel: string,
  timePicker?: ReactNode,
  className?: string,
}

/**
 * A Component for picking a date
 */
export const CalendarDatePicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start,
  end,
  initialDisplay = 'day',
  weekStart,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  yearMonthPickerProps,
  calendarDayPickerProps,
  timeLabel,
  timePicker,
  className
}: CalendarDatePickerProps) => {
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
    <div className={clsx('calendar-date-picker', className)}>
      <div className="calendar-date-picker-header">
        <div className="calendar-date-picker-selectors">
          <Button
            size="sm"
            color="neutral"
            onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
            trailing={ChevronDown}
          >
            {`${new Intl.DateTimeFormat(LocalizationUtil.isoLocaleToLanguage(locale), { month: 'short' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          </Button>
          {timePicker !== undefined && (
            <Button
              size="sm"
              color="neutral"
              onClick={() => setDisplayMode(displayMode === 'time' ? 'day' : 'time')}
              trailing={ChevronDown}
            >
              {timeLabel}
            </Button>
          )}
        </div>
        <div className="flex-row-2 justify-end">
          <IconButton
            tooltip={translation('time.today')}
            size="sm"
            variant="tonal"
            disabled={!isDayMode}
            onClick={() => {
              const newDate = new Date()
              newDate.setHours(value.getHours(), value.getMinutes())
              setValue(newDate)
              setDisplayedMonth(newDate)
            }}
            icon={Calendar}
          />
          <IconButton
            tooltip={translation('time.previousMonth')}
            size="sm"
            disabled={!isDayMode || !DateUtils.between(DateUtils.subtractDuration(displayedMonth, { months: 1 }), start, end)}
            onClick={() => {
              setDisplayedMonth(DateUtils.subtractDuration(displayedMonth, { months: 1 }))
            }}
            icon={ArrowUp}
          />
          <IconButton
            tooltip={translation('time.nextMonth')}
            size="sm"
            disabled={!isDayMode || !DateUtils.between(DateUtils.addDuration(displayedMonth, { months: 1 }), start, end)}
            onClick={() => {
              setDisplayedMonth(DateUtils.addDuration(displayedMonth, { months: 1 }))
            }}
            icon={ArrowDown}
          />
        </div>
      </div>
      {displayMode === 'yearMonth' ? (
        <YearMonthPicker
          {...yearMonthPickerProps}
          value={value}
          start={start}
          end={end}
          onValueUpdate={newDate => {
            setValue(newDate)
            setDisplayedMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
          }}
          onValueCommit={newDate => {
            setDisplayedMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
            onEditComplete?.(newDate)
          }}
          className="calendar-date-picker-content"
        />
      ) : displayMode === 'time' ? (
        <div className="calendar-date-picker-content calendar-date-picker-time">
          {timePicker}
        </div>
      ) : (
        <CalendarDayPicker
          {...calendarDayPickerProps}
          value={value}
          displayedMonth={displayedMonth}
          changeDisplayedMonth={setDisplayedMonth}
          start={start}
          end={end}
          weekStart={weekStart}
          onValueUpdate={setValue}
          onValueCommit={onEditComplete}
          className="calendar-date-picker-content"
        />
      )}
    </div>
  )
}
