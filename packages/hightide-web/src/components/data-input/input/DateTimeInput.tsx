import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import clsx from 'clsx'
import type { DateTimePickerProps } from '../date/DateTimePicker'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useDateTimeFormat, useLocalization } from '../../../global-contexts/localization/forward-exports'
import { Visibility } from '../../layout/Visibility'
import type { InputComponentInterface } from './Input'
import { DateTimePickerDialog } from '../date/DateTimePickerDialog'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { PopUp } from '../../layout/PopUp/PopUp'
import { IconButton } from '../../interaction/IconButton'
import { DateUtils, type DateTimeFormat } from '@helpwave/hightide-utils/utils'
import { DateTimeField } from './DateTimeField'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { PropsUtil } from '../../../utils/propsUtil'

export interface DateTimeInputProps extends
  Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
  InputComponentInterface<Date | null>,
  Pick<DateTimePickerProps, 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  allowRemove?: boolean,
  allowClear?: boolean,
  mode?: DateTimeFormat,
  timeZone?: string,
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof InputComponentInterface<Date> | 'mode' | 'start' | 'end' | 'weekStart' | 'markToday' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
  outsideClickCloses?: boolean,
  onDialogOpeningChange?: (isOpen: boolean) => void,
  actions?: ReactNode[],
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(function DateTimeInput({
  id: inputId,
  value,
  initialValue = null,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
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
  const { timeZone: contextTimeZone } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const resolvedIs24HourFormat = is24HourFormat ?? contextIs24HourFormat
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
    fieldRef.current?.querySelector<HTMLElement>('.date-time-segment')?.focus()
  }

  const hasClear = !required && allowClear && !readOnly && !disabled && state !== null
  const hasTimePicker = !readOnly
  const actionCount = useMemo(() => {
    let count = 0
    if(hasClear) count++
    if(hasTimePicker) count++
    count += actions.length
    return count
  }, [actions.length, hasClear, hasTimePicker])
  const hasActions = actionCount > 0


  return (
    <div {...containerProps} className={clsx('date-time-input-container', containerProps?.className)}>
      <div
        {...props}
        ref={ReactUtils.assingRefsBuilder([controlRef, forwardedRef])}
        id={ids.input}

        tabIndex={-1}

        onFocus={(event) => {
          props.onFocus?.(event)
          if (event.target === event.currentTarget && !disabled) {
            focusField()
          }
        }}

        className={clsx('date-time-input input-element', props.className)}
        data-value={PropsUtil.dataAttributes.bool(!!state)}
        data-has-actions={PropsUtil.dataAttributes.bool(hasActions)}
        {...PropsUtil.dataAttributes.interactionStates({ disabled, readOnly, invalid, required })}
        {...PropsUtil.aria.interactionStates({ disabled, readOnly, invalid, required }, props)}
        style={{
          '--action-count': actionCount,
          ...props?.style
        } as CSSProperties}
      >
        <DateTimeField
          ref={fieldRef}
          value={toZoned(state)}
          mode={mode}
          precision={precision}
          is24HourFormat={resolvedIs24HourFormat}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          required={required}
          onValueUpdate={(next) => setState(fromZoned(next))}
          onValueCommit={(next) => onEditComplete?.(fromZoned(next))}
          aria-labelledby={props['aria-labelledby']}
          aria-describedby={props['aria-describedby']}
        />
        <div className="data-time-actions-container">
          {actions}
          <Visibility isVisible={hasClear}>
            <IconButton
              tooltip={translation('clearValue')}
              variant="foreground" color="neutral" size="sm"
              onClick={() => {
                setState(null)
                onEditComplete?.(null)
              }}
              icon={X}
            />
          </Visibility>
          <Visibility isVisible={hasTimePicker}>
            <IconButton
              tooltip={translation('sDateTimeSelect', { datetimeMode: mode })}
              variant="foreground" color="neutral" size="sm"
              disabled={disabled}
              onClick={() => {
                changeOpenWrapper(true)
              }}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={isOpen ? ids.popup : undefined}
              icon={CalendarIcon}
            />
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
        data-time-format={resolvedIs24HourFormat ? '24h' : '12h'}

        className="date-time-input-dialog-popup"
      >
        <DateTimePickerDialog
          value={toZoned(dialogValue)}
          allowRemove={allowRemove}
          onValueUpdate={(value) => setDialogValue(fromZoned(value))}
          onValueCommit={(value) => {
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
          is24HourFormat={resolvedIs24HourFormat}
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
