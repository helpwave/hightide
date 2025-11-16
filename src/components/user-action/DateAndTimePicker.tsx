import type { ReactNode } from 'react'
import clsx from 'clsx'
import { addDuration, subtractDuration } from '@/src/utils/date'
import { SolidButton } from './Button'
import type { TimePickerProps } from '../date/TimePicker'
import { TimePicker } from '../date/TimePicker'
import type { DatePickerProps } from '../date/DatePicker'
import { DatePicker } from '../date/DatePicker'
import { useStandardTranslation } from '@/src/i18n/useTranslation'

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

export type DateTimePickerProps = {
  mode?: DateTimePickerMode,
  value?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  onFinish?: (date: Date) => void,
  onRemove?: () => void,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'maxHeight'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
                                 value = new Date(),
                                 start = subtractDuration(new Date(), { years: 50 }),
                                 end = addDuration(new Date(), { years: 50 }),
                                 mode = 'dateTime',
                                 onFinish,
                                 onChange,
                                 onRemove,
                                 timePickerProps,
                                 datePickerProps,
                               }: DateTimePickerProps) => {
  const translation = useStandardTranslation()

  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'

  let dateDisplay: ReactNode
  let timeDisplay: ReactNode

  if (useDate) {
    dateDisplay = (
      <DatePicker
        {...datePickerProps}
        className="min-w-[320px] min-h-[250px]"
        yearMonthPickerProps={{ maxHeight: 218 }}
        value={value}
        start={start}
        end={end}
        onChange={onChange}
      />
    )
  }
  if (useTime) {
    timeDisplay = (
      <TimePicker
        {...timePickerProps}
        className={clsx('h-full', { 'justify-between w-full': mode === 'time' })}
        maxHeight={250}
        time={value}
        onChange={onChange}
      />
    )
  }

  return (
    <div className="flex-col-2 w-fit">
      <div className="flex-row-4">
        {dateDisplay}
        {timeDisplay}
      </div>
      <div className="flex-row-2 justify-end">
        <div className="flex-row-2 mt-1">
          <SolidButton size="medium" color="negative" onClick={onRemove}>{translation('clear')}</SolidButton>
          <SolidButton
            size="medium"
            onClick={() => onFinish?.(value)}
          >
            {translation('change')}
          </SolidButton>
        </div>
      </div>
    </div>
  )
}
