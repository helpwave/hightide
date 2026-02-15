import { useControlledState } from '@/src/hooks/useControlledState'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { DateTimePicker, type DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { useEffect, useState, type ReactNode } from 'react'
import { Visibility } from '@/src/components/layout/Visibility'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '@/src/components/form/FormField'
import type { DateTimeFormat } from '@/src/utils/date'

export interface DateTimePickerDialogProps extends
Partial<FormFieldDataHandling<Date | null>>,
Pick<DateTimePickerProps, 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  pickerProps: Omit<DateTimePickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
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
  pickerProps,
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
    <>
      <div className="flex-row-2 justify-center w-full py-1">
        <span
          id={labelId}
          className="typography-title-md font-semibold"
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
      <div className="flex-row-2 justify-end">
        <Visibility isVisible={allowRemove && !!state}>
          <Button
            size="md"
            color="negative"
            onClick={() => {
              setState(null)
              onEditComplete?.(null)
            }}
            className="min-w-26"
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
            className="min-w-26"
          >
            {translation('cancel')}
          </Button>
        </Visibility>
        <Button
          size="md"
          onClick={() => {
            onEditComplete?.(pickerState)
          }}
          className="min-w-26"
        >
          {translation('done')}
        </Button>
      </div>
    </>
  )
}