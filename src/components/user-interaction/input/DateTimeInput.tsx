import type { HTMLAttributes, InputHTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import clsx from 'clsx'
import type { DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '@/src/components/layout/Visibility'
import type { FormFieldDataHandling } from '../../form/FormField'
import { DateTimePickerDialog } from '../date/DateTimePickerDialog'
import { useControlledState } from '@/src/hooks/useControlledState'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '@/src/components/form/FieldLayout'
import { PopUp } from '../../layout/popup/PopUp'
import { IconButton } from '../IconButton'
import { DateUtils, type DateTimeFormat } from '@/src/utils/date'

export interface DateTimeInputProps extends
  Partial<FormFieldInteractionStates>,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value' | 'placeholder'>,
  Partial<FormFieldDataHandling<Date | null>>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  mode?: DateTimeFormat,
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof FormFieldDataHandling<Date> | 'mode' | 'initialValue'>,
  outsideClickCloses?: boolean,
  onDialogOpeningChange?: (isOpen: boolean) => void,
}

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(function DateTimeInput({
  id: inputId,
  value,
  initialValue = null,
  onValueChange,
  onEditComplete,
  allowRemove = false,
  containerProps,
  mode = 'date',
  pickerProps,
  outsideClickCloses = true,
  onDialogOpeningChange,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useControlledState<Date | null>({
    value,
    onValueChange,
    defaultValue: initialValue,
  })
  const [dialogValue, setDialogValue] = useState<Date>(state ?? new Date())
  const [dateString, setDateString] = useState<string>(state ? DateUtils.toInputString(state, mode) : '')

  useEffect(() => {
    setDialogValue(state ?? new Date())
    setDateString(state ? DateUtils.toInputString(state, mode) : '')
  }, [mode, state])

  const changeOpenWrapper = useCallback((isOpen: boolean) => {
    onDialogOpeningChange?.(isOpen)
    setIsOpen(isOpen)
  }, [onDialogOpeningChange])

  const generatedId = useId()
  const ids = useMemo(() => ({
    input: inputId ?? `date-time-input-${generatedId}`,
    popup: `date-time-input-popup-${generatedId}`,
    label: `date-time-input-label-${generatedId}`,
  }), [generatedId, inputId])

  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  useEffect(() => {
    if (readOnly || disabled) {
      changeOpenWrapper(false)
    }
  }, [changeOpenWrapper, readOnly, disabled])

  return (
    <>
      <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
        <input
          {...props}
          ref={innerRef}
          id={ids.input}
          value={dateString}

          onChange={(event) => {
            const date = event.target.valueAsDate
            if(date) {
              setState(date)
            } else {
              setDateString(event.target.value)
            }
          }}

          type={mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local'}

          {...PropsUtil.dataAttributes.interactionStates({ disabled, readOnly, invalid, required })}

          data-name={props['data-name'] ?? 'date-time-input'}
          data-value={PropsUtil.dataAttributes.bool(!!state || !!dateString)}
          {...PropsUtil.aria.interactionStates({ disabled, readOnly, invalid, required }, props)}
        />
        <Visibility isVisible={!readOnly}>
          <IconButton
            tooltip={translation('sDateTimeSelect', { datetimeMode: mode })}
            coloringStyle="text" color="neutral" size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            disabled={disabled}
            onClick={() => {
              changeOpenWrapper(true)
            }}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? ids.popup : undefined}
          >
            <CalendarIcon className="size-5"/>
          </IconButton>
        </Visibility>
      </div>
      <PopUp
        id={ids.popup}
        isOpen={isOpen}
        anchor={innerRef}
        options={{
          verticalAlignment: 'afterEnd',
          horizontalAlignment: 'center',
          gap: 4,
        }}
        outsideClickOptions={{ refs: [innerRef], active: outsideClickCloses }}

        onClose={() => {
          changeOpenWrapper(false)
          onEditComplete?.(state)
        }}

        role="dialog"
        aria-labelledby={ids.label}

        className="flex-col-2 p-2"
      >
        <DateTimePickerDialog
          value={dialogValue}
          allowRemove={allowRemove}
          onValueChange={setDialogValue}
          onEditComplete={(value) => {
            setState(value)
            onEditComplete?.(value)
            changeOpenWrapper(false)
          }}
          pickerProps={pickerProps}
          mode={mode}
        />
      </PopUp>
    </>
  )
})
