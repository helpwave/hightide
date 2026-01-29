import { useControlledState, type ControlledStateProps } from '@/src/hooks/useControlledState'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { DateTimePicker, type DateTimePickerProps } from './DateTimePicker'
import { useState, type ReactNode } from 'react'
import { Visibility } from '../../layout/Visibility'
import { Button } from '../Button'

export interface DateTimePickerDialogProps extends ControlledStateProps<Date | null> {
  allowRemove?: boolean,
  onEditComplete?: (value: Date | null) => void,
  pickerProps: Omit<DateTimePickerProps, 'value' | 'onValueChange' | 'onEditComplete'>,
  mode?: 'date' | 'dateTime',
  label?: ReactNode,
  labelId?: string,
}

export const DateTimePickerDialog = ({
  defaultValue,
  value,
  allowRemove = true,
  onValueChange,
  onEditComplete,
  isControlled,
  mode = 'date',
  pickerProps,
  labelId,
  label,
}: DateTimePickerDialogProps) => {
  const translation = useHightideTranslation()
  const [state, setState] = useControlledState({
    value,
    onValueChange,
    defaultValue: defaultValue,
    isControlled,
  })

  const [initialValue] = useState(state)

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
        value={state ?? undefined}
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
            onValueChange?.(state)
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