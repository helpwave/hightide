import type { FocusEvent, HTMLAttributes, KeyboardEvent } from 'react'
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '@/src/components/form/FieldLayout'
import type { FormFieldDataHandling } from '@/src/components/form/FormField'
import type { DateTimeFormat, DateTimePrecision } from '@/src/utils/date'
import type { EditableSegmentType, SegmentEditState } from './dateTimeSegments'
import {
  buildSegmentLayout,
  clearSegment,
  composeDate,
  decomposeDate,
  editableTypesOf,
  formatSegment,
  isEmpty,
  segmentBounds,
  setDayPeriod,
  stepSegment,
  timeUnitTranslationKey,
  typeDigit
} from './dateTimeSegments'

const advanceKeys = ['.', ':', '/', ',', '-', ' ']

export interface DateTimeFieldProps extends
  Partial<FormFieldInteractionStates>,
  Partial<FormFieldDataHandling<Date | null>>,
  Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  initialValue?: Date | null,
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
  is24HourFormat?: boolean,
  locale?: string,
}

export const DateTimeField = forwardRef<HTMLDivElement, DateTimeFieldProps>(function DateTimeField({
  value: controlledValue,
  initialValue = null,
  onValueChange,
  onEditComplete,
  mode = 'date',
  precision = 'minute',
  is24HourFormat,
  locale: localeOverride,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  className,
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { locale: contextLocale } = useLocale()
  const locale = localeOverride ?? contextLocale

  const [value, setValue] = useControlledState<Date | null>({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })

  const is24Hour = useMemo(() => {
    if (is24HourFormat !== undefined) {
      return is24HourFormat
    }
    return !new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12
  }, [is24HourFormat, locale])

  const layout = useMemo(
    () => buildSegmentLayout({ locale, mode, precision, is24HourFormat: is24Hour }),
    [locale, mode, precision, is24Hour]
  )
  const editableTypes = useMemo(() => editableTypesOf(layout), [layout])

  const [editState, setEditState] = useState<SegmentEditState>(() => ({
    values: value ? decomposeDate(value, layout, is24Hour) : {},
    buffer: null,
  }))
  const [focusedType, setFocusedType] = useState<EditableSegmentType | null>(null)

  const editStateRef = useRef(editState)
  editStateRef.current = editState

  const segmentRefs = useRef(new Map<EditableSegmentType, HTMLSpanElement>())
  const segmentRefCallbacks = useRef(new Map<EditableSegmentType, (element: HTMLSpanElement | null) => void>())
  const registerSegment = (type: EditableSegmentType) => {
    const existing = segmentRefCallbacks.current.get(type)
    if (existing) {
      return existing
    }
    const callback = (element: HTMLSpanElement | null) => {
      if (element) {
        segmentRefs.current.set(type, element)
      } else {
        segmentRefs.current.delete(type)
      }
    }
    segmentRefCallbacks.current.set(type, callback)
    return callback
  }

  useEffect(() => {
    if (editStateRef.current.buffer) {
      return
    }
    const shown = composeDate(editStateRef.current.values, layout, mode, is24Hour, value ?? undefined)
    if ((shown?.getTime() ?? null) === (value?.getTime() ?? null)) {
      return
    }
    setEditState({
      values: value ? decomposeDate(value, layout, is24Hour) : {},
      buffer: null,
    })
  }, [value, layout, mode, is24Hour])

  const apply = (next: SegmentEditState) => {
    setEditState(next)
    if (next.buffer?.type === 'year') {
      return
    }
    const composed = composeDate(next.values, layout, mode, is24Hour, value ?? undefined)
    if (composed) {
      setValue(composed)
    } else if (isEmpty(next.values, layout) && value !== null) {
      setValue(null)
    }
  }

  const focusType = (type: EditableSegmentType) => {
    setFocusedType(type)
  }

  useLayoutEffect(() => {
    if (focusedType === null) {
      return
    }
    const element = segmentRefs.current.get(focusedType)
    if (element && document.activeElement !== element) {
      element.focus()
    }
  }, [focusedType])

  const neighbour = (type: EditableSegmentType, offset: number) => editableTypes[editableTypes.indexOf(type) + offset]

  const onSegmentKeyDown = (event: KeyboardEvent<HTMLSpanElement>, type: EditableSegmentType) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const target = neighbour(type, event.key === 'ArrowLeft' ? -1 : 1)
      if (target) {
        focusType(target)
      }
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      focusType(event.key === 'Home' ? editableTypes[0] : editableTypes[editableTypes.length - 1])
      return
    }
    if (event.key === 'Tab') {
      const target = neighbour(type, event.shiftKey ? -1 : 1)
      if (target) {
        event.preventDefault()
        focusType(target)
      }
      return
    }

    if (readOnly) {
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      apply(stepSegment(editState, type, event.key === 'ArrowUp' ? 1 : -1, is24Hour))
      return
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      const hasContent = editState.values[type] !== undefined || editState.buffer?.type === type
      if (hasContent) {
        apply(clearSegment(editState, type))
      } else if (event.key === 'Backspace') {
        const target = neighbour(type, -1)
        if (target) {
          focusType(target)
        }
      }
      return
    }
    if (type === 'dayPeriod') {
      if (event.key.toLowerCase() === 'a') {
        event.preventDefault()
        apply(setDayPeriod(editState, 0))
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        apply(setDayPeriod(editState, 1))
      }
      return
    }
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault()
      const result = typeDigit(editState, type, Number(event.key), is24Hour)
      apply(result.state)
      if (result.advance) {
        const target = neighbour(type, 1)
        if (target) {
          focusType(target)
        }
      }
      return
    }
    if (advanceKeys.includes(event.key)) {
      event.preventDefault()
      const target = neighbour(type, 1)
      if (target) {
        focusType(target)
      }
    }
  }

  const onFieldBlur = (event: FocusEvent<HTMLDivElement>) => {
    props.onBlur?.(event)
    const field = event.currentTarget
    const nextFocus = event.relatedTarget
    if (nextFocus instanceof Node && field.contains(nextFocus)) {
      return
    }
    requestAnimationFrame(() => {
      if (field.contains(document.activeElement)) {
        return
      }
      setFocusedType(null)
      const composed = composeDate(editStateRef.current.values, layout, mode, is24Hour, value ?? undefined)
      if (composed) {
        setEditState({ values: decomposeDate(composed, layout, is24Hour), buffer: null })
        if (composed.getTime() !== (value?.getTime() ?? null)) {
          setValue(composed)
        }
        onEditComplete?.(composed)
      } else {
        onEditComplete?.(value ?? null)
      }
    })
  }

  const activeType = focusedType ?? editableTypes[0]

  return (
    <div
      {...props}
      ref={forwardedRef}

      role="group"

      onBlur={onFieldBlur}
      onMouseDown={(event) => {
        props.onMouseDown?.(event)
        if (event.target === event.currentTarget && !disabled) {
          event.preventDefault()
          focusType(activeType)
        }
      }}

      className={clsx(className)}
      data-name="date-time-field"
      {...PropsUtil.dataAttributes.interactionStates({ disabled, readOnly, invalid, required })}
      {...PropsUtil.aria.interactionStates({ disabled, readOnly, invalid, required })}
    >
      {layout.map((segment, index) => {
        if (segment.kind === 'literal') {
          return (
            <span key={`literal-${index}`} aria-hidden={true} data-name="date-time-separator">
              {segment.text}
            </span>
          )
        }

        const type = segment.type
        const bounds = segmentBounds(type, editState.values, is24Hour)
        const numericValue = editState.values[type]
        const display = formatSegment(type, editState.values, editState.buffer, locale)

        return (
          <span
            key={type}
            ref={registerSegment(type)}

            role="spinbutton"
            tabIndex={disabled ? -1 : (type === activeType ? 0 : -1)}

            onKeyDown={(event) => onSegmentKeyDown(event, type)}
            onFocus={() => {
              setFocusedType(type)
              if (editState.buffer && editState.buffer.type !== type) {
                setEditState(state => ({ ...state, buffer: null }))
              }
            }}

            data-name="date-time-segment"
            data-placeholder={PropsUtil.dataAttributes.bool(numericValue === undefined && editState.buffer?.type !== type)}
            aria-label={type === 'dayPeriod' ? translation('dayPeriod') : translation(timeUnitTranslationKey[type], { count: 1 })}
            aria-valuemin={type === 'dayPeriod' ? undefined : bounds.min}
            aria-valuemax={type === 'dayPeriod' ? undefined : bounds.max}
            aria-valuenow={numericValue}
            aria-valuetext={display}
          >
            {display}
          </span>
        )
      })}
    </div>
  )
})
