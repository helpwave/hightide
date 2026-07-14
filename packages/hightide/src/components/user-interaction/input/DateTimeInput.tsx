import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import clsx from 'clsx'
import type { DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { Visibility } from '@/src/components/layout/Visibility'
import type { FormFieldDataHandling } from '../../form/FormField'
import { DateTimePickerDialog } from '../date/DateTimePickerDialog'
import { useControlledState } from '@helpwave/hightide-utils'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '@/src/components/form/FieldLayout'
import { PopUp } from '../../layout/popup/PopUp'
import { IconButton } from '../IconButton'
import { DateUtils, type DateTimeFormat } from '@helpwave/hightide-utils'
import { DateTimeField } from './DateTimeField'
import { ReactRefsUtil } from '@helpwave/hightide-utils'

export interface DateTimeInputProps extends
  Partial<FormFieldInteractionStates>,
  Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
  Partial<FormFieldDataHandling<Date | null>>,
  Pick<DateTimePickerProps, 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  allowClear?: boolean,
  mode?: DateTimeFormat,
  timeZone?: string,
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof FormFieldDataHandling<Date> | 'mode' | 'initialValue' | 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
  outsideClickCloses?: boolean,
  onDialogOpeningChange?: (isOpen: boolean) => void,
  actions?: ReactNode[],
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(function DateTimeInput({
  id: inputId,
  value,
  initialValue = null,
  onValueChange,
  onEditComplete,
  allowRemove = false,
  allowClear = true,
  containerProps,
  mode = 'date',
  timeZone: timeZoneOverride,
  precision = 'minute',
  pickerProps,
  outsideClickCloses = true,
  onDialogOpeningChange,
  start,
  end,
  weekStart,
  markToday,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  actions = [],
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { timeZone: contextTimeZone } = useLocale()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useControlledState<Date | null>({
    value,
    onValueChange,
    defaultValue: initialValue,
  })
  const [dialogValue, setDialogValue] = useState<Date | null>(state)

  const changeOpenWrapper = useCallback((isOpen: boolean) => {
    onDialogOpeningChange?.(isOpen)
    setIsOpen(isOpen)
  }, [onDialogOpeningChange])

  const toZoned = useCallback((date: Date | null) => DateUtils.toZonedDate(date, timeZone), [timeZone])
  const fromZoned = useCallback((date: Date | null) => DateUtils.fromZonedDate(date, timeZone), [timeZone])

  const generatedId = useId()
  const ids = useMemo(() => ({
    input: inputId ?? `date-time-input-${generatedId}`,
    popup: `date-time-input-popup-${generatedId}`,
    label: `date-time-input-label-${generatedId}`,
  }), [generatedId, inputId])

  const controlRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (readOnly || disabled) {
      changeOpenWrapper(false)
    }
  }, [changeOpenWrapper, readOnly, disabled])

  useEffect(() => {
    if (isOpen) {
      setDialogValue(state)
    }
  }, [isOpen, state])

  const focusField = () => {
    fieldRef.current?.querySelector<HTMLElement>('[data-name="date-time-segment"]')?.focus()
  }

  const hasClear = !required && allowClear && !readOnly && !disabled && state !== null
  const hasTimePicker = !readOnly
  const hasActions = hasClear || hasTimePicker || actions.length > 0

  return (
    <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
      <div
        {...props}
        ref={ReactRefsUtil.assingRefsBuilder([controlRef, forwardedRef])}
        id={ids.input}

        tabIndex={-1}

        onFocus={(event) => {
          props.onFocus?.(event)
          if (event.target === event.currentTarget && !disabled) {
            focusField()
          }
        }}

        className={clsx('date-time-input', props.className)}
        data-name="date-time-input"
        data-value={PropsUtil.dataAttributes.bool(!!state)}
        data-has-actions={PropsUtil.dataAttributes.bool(hasActions)}
        {...PropsUtil.dataAttributes.interactionStates({ disabled, readOnly, invalid, required })}
        {...PropsUtil.aria.interactionStates({ disabled, readOnly, invalid, required }, props)}
      >
        <DateTimeField
          ref={fieldRef}
          value={toZoned(state)}
          mode={mode}
          precision={precision}
          is24HourFormat={is24HourFormat}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          required={required}
          onValueChange={(next) => setState(fromZoned(next))}
          onEditComplete={(next) => onEditComplete?.(fromZoned(next))}
          aria-labelledby={props['aria-labelledby']}
          aria-describedby={props['aria-describedby']}
        />
        <div className="flex-row-1 items-center">
          {actions}
          <Visibility isVisible={hasClear}>
            <IconButton
              tooltip={translation('clearValue')}
              coloringStyle="text" color="neutral" size="sm"
              onClick={() => {
                setState(null)
                onEditComplete?.(null)
              }}
            >
              <X className="size-5"/>
            </IconButton>
          </Visibility>
          <Visibility isVisible={hasTimePicker}>
            <IconButton
              tooltip={translation('sDateTimeSelect', { datetimeMode: mode })}
              coloringStyle="text" color="neutral" size="sm"
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
      </div>
      <PopUp
        id={ids.popup}
        isOpen={isOpen}
        anchor={controlRef}
        options={{
          verticalAlignment: 'afterEnd',
          horizontalAlignment: 'center',
          gap: 4,
        }}
        outsideClickOptions={{ refs: [controlRef], active: outsideClickCloses }}

        onClose={() => {
          changeOpenWrapper(false)
          onEditComplete?.(state)
        }}

        role="dialog"
        aria-labelledby={ids.label}

        data-mode={mode}

        className="date-time-input-dialog-popup"
      >
        <DateTimePickerDialog
          value={toZoned(dialogValue)}
          allowRemove={allowRemove}
          onValueChange={(value) => setDialogValue(fromZoned(value))}
          onEditComplete={(value) => {
            const absolute = fromZoned(value)
            setState(absolute)
            onEditComplete?.(absolute)
            changeOpenWrapper(false)
          }}
          pickerProps={{ ...(pickerProps ?? {}), className: 'date-time-input-date-time-picker' }}
          mode={mode}
          start={toZoned(start ?? null) ?? undefined}
          end={toZoned(end ?? null) ?? undefined}
          weekStart={weekStart}
          markToday={markToday}
          is24HourFormat={is24HourFormat}
          minuteIncrement={minuteIncrement}
          secondIncrement={secondIncrement}
          millisecondIncrement={millisecondIncrement}
          precision={precision}
          className="date-time-input-dialog"
        />
      </PopUp>
    </div>
  )
})
