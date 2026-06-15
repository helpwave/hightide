import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { CalendarIcon, X } from 'lucide-react'
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
import { DateTimeField } from './DateTimeField'

export interface DateTimeInputProps extends
  Partial<FormFieldInteractionStates>,
  Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
  Partial<FormFieldDataHandling<Date | null>>,
  Pick<DateTimePickerProps, 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  /** Shows a clear button on optional fields with a value. Has no effect when required. Defaults to true */
  allowClear?: boolean,
  mode?: DateTimeFormat,
  /**
   * Display and edit the value as the wall clock of this IANA time zone (e.g. `'Europe/Berlin'`,
   * `'UTC'`) instead of the viewer's local zone. The value contract is unchanged: `value`,
   * `onValueChange` and `onEditComplete` keep using absolute `Date` instants — only the segments
   * the user sees and types are interpreted in this zone. Leave undefined to use the local zone.
   */
  timeZone?: string,
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof FormFieldDataHandling<Date> | 'mode' | 'initialValue' | 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
  outsideClickCloses?: boolean,
  onDialogOpeningChange?: (isOpen: boolean) => void,
  actions?: ReactNode[],
}

/**
 * An input for picking a date, a time or both.
 *
 * The value can be typed segment by segment with the keyboard or selected from the calendar
 * dialog. Both paths write to the same value, so the displayed input and the stored value
 * always stay in sync.
 */
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
  timeZone,
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

  // The field and calendar always work in the local wall clock. When a time zone is given we hand
  // them a value shifted to that zone's wall clock and convert every edit back to an absolute
  // instant on the way out, so the public value contract stays time-zone agnostic.
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
  useImperativeHandle(forwardedRef, () => controlRef.current as HTMLDivElement)

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

  return (
    <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
      <div
        {...props}
        ref={controlRef}
        id={ids.input}

        tabIndex={-1}

        onFocus={(event) => {
          props.onFocus?.(event)
          if (event.target === event.currentTarget && !disabled) {
            focusField()
          }
        }}

        className={clsx('cursor-text', props.className)}
        data-name={props['data-name'] ?? 'date-time-input'}
        data-value={PropsUtil.dataAttributes.bool(!!state)}
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
          className="grow"
        />
        <div className="flex-row-1 items-center">
          {actions}
          <Visibility isVisible={!required && allowClear && !readOnly && !disabled && state !== null}>
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
          <Visibility isVisible={!readOnly}>
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

        className="flex-col-2 p-2"
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
          pickerProps={pickerProps}
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
        />
      </PopUp>
    </div>
  )
})
