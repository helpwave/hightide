import { useControlledState } from '@helpwave/hightide-utils'
import { useHightideTranslation } from '@helpwave/hightide-utils'
import { DateTimePicker, type DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import type { HTMLAttributes } from 'react'
import { useEffect, useState, type ReactNode } from 'react'
import { Visibility } from '@/src/components/layout/Visibility'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '@/src/components/form/FormField'
import type { DateTimeFormat } from '@helpwave/hightide-utils'
import clsx from 'clsx'

export interface DateTimePickerDialogProps extends
HTMLAttributes<HTMLDivElement>,
Partial<FormFieldDataHandling<Date | null>>,
Pick<DateTimePickerProps, 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  pickerProps?: Omit<DateTimePickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
  mode?: DateTimeFormat,
  label?: ReactNode,
  labelId?: string,
}

export const DateTimePickerDialog = ({
  initialValue = null,
  value,
  allowRemove = true,
  onValueChange,
  onEditComplete,
  mode = 'date',
  pickerProps = {},
  start,
  end,
  weekStart,
  markToday,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  labelId,
  label,
  ...props
}: DateTimePickerDialogProps) => {
  const translation = useHightideTranslation()
  const [state, setState] = useControlledState({
    value,
    onValueChange,
    defaultValue: initialValue
  })

  const [pickerState, setPickerState] = useState(state ?? new Date())

  useEffect(() => {
    setPickerState(state ?? new Date())
  }, [state])

  return (
    <div {...props} className={clsx('date-time-picker-dialog', props?.className)}>
      <div className="date-time-picker-dialog-header">
        <span
          id={labelId}
          className="date-time-picker-dialog-label"
        >
          {label ?? translation('sDateTimeSelect', { datetimeMode: mode })}
        </span>
      </div>
      <DateTimePicker
        {...pickerProps}
        mode={mode}
        value={pickerState}
        onValueChange={setPickerState}
        onEditComplete={setPickerState}
        start={start}
        end={end}
        weekStart={weekStart}
        markToday={markToday}
        is24HourFormat={is24HourFormat}
        minuteIncrement={minuteIncrement}
        secondIncrement={secondIncrement}
        millisecondIncrement={millisecondIncrement}
        precision={precision}
      />
      <div className="date-time-picker-dialog-actions">
        <Visibility isVisible={allowRemove && !!state}>
          <Button
            size="md"
            color="negative"
            onClick={() => {
              setState(null)
              onEditComplete?.(null)
            }}
            className="date-time-picker-dialog-action"
          >
            {translation('clear')}
          </Button>
        </Visibility>
        <Visibility isVisible={!state}>
          <Button
            size="md"
            color="neutral"
            onClick={() => {
              setState(state)
              onEditComplete?.(state)
            }}
            className="date-time-picker-dialog-action"
          >
            {translation('cancel')}
          </Button>
        </Visibility>
        <Button
          size="md"
          onClick={() => {
            onEditComplete?.(pickerState)
          }}
          className="date-time-picker-dialog-action"
        >
          {translation('done')}
        </Button>
      </div>
    </div>
  )
}