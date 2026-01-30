import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import clsx from 'clsx'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import type { DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '@/src/components/layout/Visibility'
import { DateUtils } from '@/src/utils/date'
import type { FormFieldDataHandling } from '../../form/FormField'
import { DateTimePickerDialog } from '../date/DateTimePickerDialog'
import type { ControlledStateProps } from '@/src/hooks/useControlledState'
import { useControlledState } from '@/src/hooks/useControlledState'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '@/src/components/form/FieldLayout'
import { PopUp } from '../../layout/popup/PopUp'
import { IconButton } from '../IconButton'

export interface DateTimeInputProps extends
  Partial<FormFieldInteractionStates>,
  ControlledStateProps<Date | null>,
  Omit<ButtonHTMLAttributes<HTMLDivElement>, 'defaultValue' | 'value'>,
  Partial<FormFieldDataHandling<Date | null>>
{
  placeholder?: ReactNode,
  allowRemove?: boolean,
  // TODO allow mode = time
  mode?: 'date' | 'dateTime',
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof FormFieldDataHandling<Date> | 'mode'>,
  outsideClickCloses?: boolean,
  onDialogOpeningChange?: (isOpen: boolean) => void,
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(function DateTimeInput({
  value,
  defaultValue = null,
  placeholder,
  isControlled,
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
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useControlledState({
    value,
    onValueChange,
    defaultValue,
    isControlled,
  })
  const [dialogValue, setDialogValue] = useState(state)
  useEffect(() => {
    setDialogValue(state)
  }, [state])

  const changeOpenWrapper = useCallback((isOpen: boolean) => {
    onDialogOpeningChange?.(isOpen)
    setIsOpen(isOpen)
  }, [onDialogOpeningChange])

  const id = useId()
  const ids = useMemo(() => ({
    input: `date-time-input-${id}`,
    popup: `date-time-input-popup-${id}`,
    label: `date-time-input-label-${id}`,
  }), [id])

  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  useEffect(() => {
    if (readOnly || disabled) {
      changeOpenWrapper(false)
    }
  }, [changeOpenWrapper, readOnly, disabled])

  const clickHandler = PropsUtil.aria.click<HTMLDivElement>(() => changeOpenWrapper(true))

  return (
    <>
      <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
        <div
          {...props}
          ref={innerRef}
          id={ids.input}

          onClick={(event) => {
            clickHandler.onClick()
            props.onClick?.(event)
          }}
          onKeyDown={clickHandler.onKeyDown}

          {...PropsUtil.dataAttributes.interactionStates({ disabled, readOnly, invalid, required })}

          data-value={PropsUtil.dataAttributes.bool(!!state)}
          {...PropsUtil.aria.interactionStates({ disabled, readOnly, invalid, required }, props)}

          tabIndex={0}
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? ids.popup : undefined}

          className={clsx(
            'input-element flex-row-2 px-3 pr-10 h-default rounded-md w-full items-center justify-between',
            { 'hover:cursor-pointer': !readOnly },
            props.className
          )}
        >
          {state ? DateUtils.formatAbsolute(state, locale, mode === 'dateTime') : placeholder ?? translation('clickToSelect')}
        </div>
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
            setState?.(value)
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
