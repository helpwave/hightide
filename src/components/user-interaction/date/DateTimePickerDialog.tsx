import { useControlledState } from '@/src/hooks/useControlledState'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { DateTimePicker, type DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { type ReactNode } from 'react'
import { Visibility } from '@/src/components/layout/Visibility'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '@/src/components/form/FormField'
import type { DateTimeFormat } from '@/src/utils/date'

export interface DateTimePickerDialogProps extends Partial<FormFieldDataHandling<Date | null>> {
  initialValue?: Date | null,
  allowRemove?: boolean,
  onEditComplete?: (value: Date | null) => void,
  pickerProps: Omit<DateTimePickerProps, 'value' | 'onValueChange' | 'onEditComplete'>,
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
  labelId,
  label,
}: DateTimePickerDialogProps) => {
  const translation = useHightideTranslation()
  const [state, setState] = useControlledState({
    value,
    onValueChange,
    defaultValue: initialValue
  })

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
        value={state}
        onValueChange={setState}
        onEditComplete={setState}
      />
      <div className="flex-row-2 justify-end">
        <Visibility isVisible={allowRemove && !!initialValue}>
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
        <Visibility isVisible={!initialValue}>
          <Button
            size="md"
            color="neutral"
            onClick={() => {
              setState(initialValue)
              onEditComplete?.(initialValue)
            }}
            className="min-w-26"
          >
            {translation('cancel')}
          </Button>
        </Visibility>
        <Button
          size="md"
          onClick={() => {
            onEditComplete?.(state)
          }}
          className="min-w-26"
        >
          {translation('done')}
        </Button>
      </div>
    </>
  )
}