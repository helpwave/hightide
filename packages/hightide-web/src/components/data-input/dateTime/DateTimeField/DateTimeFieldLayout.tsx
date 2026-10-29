import clsx from 'clsx'
import type { FocusEvent, HTMLAttributes, KeyboardEvent } from 'react'
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { PropsUtil } from '../../../../utils/propsUtil'
import { SafeGlobals } from '../../../../utils/safeGlobals'
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
  typeDigit,
  type EditableSegmentType,
  type SegmentEditState,
  type SegmentValues
} from '../dateTimeSegments'
import { useDateTimeFieldContext } from './DateTimeFieldContext'
import { DateTimeFieldSegment } from './DateTimeFieldSegment'
import { DateTimeFieldSeparator } from './DateTimeFieldSeparator'

const advanceKeys = ['.', ':', '/', ',', '-', ' ']

function sameSegmentValues(left: SegmentValues, right: SegmentValues) {
  const keys = new Set<string>([...Object.keys(left), ...Object.keys(right)])
  for (const key of keys) {
    const segment = key as EditableSegmentType
    if (left[segment] !== right[segment]) return false
  }
  return true
}

export type DateTimeFieldLayoutProps = HTMLAttributes<HTMLDivElement> & {
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
}

export const DateTimeFieldLayout = forwardRef<HTMLDivElement, DateTimeFieldLayoutProps>(function DateTimeFieldLayout({
  mode = 'date',
  precision = 'minute',
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { state, dispatch, config, locale, is24HourFormat } = useDateTimeFieldContext()
  const layout = useMemo(
    () => buildSegmentLayout({ locale, mode, precision, is24HourFormat }),
    [is24HourFormat, locale, mode, precision]
  )
  const editableTypes = useMemo(() => editableTypesOf(layout), [layout])
  const segmentRefs = useRef(new Map<EditableSegmentType, HTMLSpanElement>())
  const segmentRefCallbacks = useRef(new Map<EditableSegmentType, (element: HTMLSpanElement | null) => void>())
  const editRef = useRef(state.edit)
  editRef.current = state.edit
  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch

  const registerSegment = (type: EditableSegmentType) => {
    const existing = segmentRefCallbacks.current.get(type)
    if (existing) return existing
    const callback = (element: HTMLSpanElement | null) => {
      if (element) segmentRefs.current.set(type, element)
      else segmentRefs.current.delete(type)
    }
    segmentRefCallbacks.current.set(type, callback)
    return callback
  }

  useEffect(() => {
    if (editRef.current.buffer) return
    const shown = composeDate(editRef.current.values, layout, mode, is24HourFormat, state.value ?? undefined)
    if ((shown?.getTime() ?? null) === (state.value?.getTime() ?? null)) return
    const values = state.value ? decomposeDate(state.value, layout, is24HourFormat) : {}
    if (sameSegmentValues(editRef.current.values, values)) return
    dispatchRef.current({
      type: 'sync',
      value: state.value,
      edit: { values, buffer: null },
    })
  }, [is24HourFormat, layout, mode, state.value])

  const apply = (next: SegmentEditState) => {
    let value = state.value
    if (next.buffer?.type !== 'year') {
      const composed = composeDate(next.values, layout, mode, is24HourFormat, state.value ?? undefined)
      if (composed) value = composed
      else if (isEmpty(next.values, layout) && state.value !== null) value = null
    }
    dispatch({ type: 'edit', edit: next, value })
  }

  useLayoutEffect(() => {
    if (state.focusedType === null) return
    const element = segmentRefs.current.get(state.focusedType)
    const doc = SafeGlobals.document('DateTimeField.focusSegment')
    if (element && doc?.activeElement !== element) {
      element.focus()
    }
  }, [state.focusedType])

  const neighbour = (type: EditableSegmentType, offset: number) => editableTypes[editableTypes.indexOf(type) + offset]

  const onSegmentKeyDown = (event: KeyboardEvent<HTMLSpanElement>, type: EditableSegmentType) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const target = neighbour(type, event.key === 'ArrowLeft' ? -1 : 1)
      if (target) dispatch({ type: 'focus', focusedType: target })
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      dispatch({ type: 'focus', focusedType: event.key === 'Home' ? editableTypes[0] : editableTypes[editableTypes.length - 1] })
      return
    }
    if (event.key === 'Tab') {
      const target = neighbour(type, event.shiftKey ? -1 : 1)
      if (target) {
        event.preventDefault()
        dispatch({ type: 'focus', focusedType: target })
      }
      return
    }
    if (config.isReadOnly) return
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      apply(stepSegment(state.edit, type, event.key === 'ArrowUp' ? 1 : -1, is24HourFormat))
      return
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      const hasContent = state.edit.values[type] !== undefined || state.edit.buffer?.type === type
      if (hasContent) {
        apply(clearSegment(state.edit, type))
      } else if (event.key === 'Backspace') {
        const target = neighbour(type, -1)
        if (target) dispatch({ type: 'focus', focusedType: target })
      }
      return
    }
    if (type === 'dayPeriod') {
      if (event.key.toLowerCase() === 'a') {
        event.preventDefault()
        apply(setDayPeriod(state.edit, 0))
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        apply(setDayPeriod(state.edit, 1))
      }
      return
    }
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault()
      const result = typeDigit(state.edit, type, Number(event.key), is24HourFormat)
      const target = result.advance ? neighbour(type, 1) : undefined
      let value = state.value
      if (result.state.buffer?.type !== 'year') {
        const composed = composeDate(result.state.values, layout, mode, is24HourFormat, state.value ?? undefined)
        if (composed) value = composed
        else if (isEmpty(result.state.values, layout) && state.value !== null) value = null
      }
      dispatch({
        type: 'edit',
        edit: result.state,
        value,
        focusedType: target,
      })
      return
    }
    if (advanceKeys.includes(event.key)) {
      event.preventDefault()
      const target = neighbour(type, 1)
      if (target) dispatch({ type: 'focus', focusedType: target })
    }
  }

  const onFieldBlur = (event: FocusEvent<HTMLDivElement>) => {
    props.onBlur?.(event)
    const field = event.currentTarget
    const nextFocus = event.relatedTarget
    if (nextFocus instanceof Node && field.contains(nextFocus)) return
    SafeGlobals.window('DateTimeField.onFieldBlur')?.requestAnimationFrame(() => {
      const doc = SafeGlobals.document('DateTimeField.onFieldBlur')
      if (field.contains(doc?.activeElement ?? null)) return
      const composed = composeDate(editRef.current.values, layout, mode, is24HourFormat, state.value ?? undefined)
      if (composed) {
        dispatch({
          type: 'commit',
          value: composed,
          edit: { values: decomposeDate(composed, layout, is24HourFormat), buffer: null },
        })
      } else {
        dispatch({
          type: 'commit',
          value: state.value,
          edit: editRef.current,
        })
      }
    })
  }

  const activeType = state.focusedType ?? editableTypes[0]

  return (
    <div
      {...props}
      ref={forwardedRef}
      role="group"
      onBlur={onFieldBlur}
      onMouseDown={(event) => {
        props.onMouseDown?.(event)
        if (event.target === event.currentTarget && !config.isDisabled) {
          event.preventDefault()
          dispatch({ type: 'focus', focusedType: activeType })
        }
      }}
      className={clsx('date-time-field', props.className)}
      {...PropsUtil.dataAttributes.interactionStates({
        disabled: config.isDisabled,
        readOnly: config.isReadOnly,
        invalid: config.isInvalid,
        required: config.isRequired,
      })}
      {...PropsUtil.aria.interactionStates({
        disabled: config.isDisabled,
        readOnly: config.isReadOnly,
        invalid: config.isInvalid,
        required: config.isRequired,
      })}
    >
      {layout.map((segment, index) => {
        if (segment.kind === 'literal') {
          return <DateTimeFieldSeparator key={`literal-${index}`} text={segment.text} />
        }
        const type = segment.type
        const bounds = segmentBounds(type, state.edit.values, is24HourFormat)
        const numericValue = state.edit.values[type]
        const display = formatSegment(type, state.edit.values, state.edit.buffer, locale)
        return (
          <DateTimeFieldSegment
            key={type}
            type={type}
            display={display}
            isPlaceholder={numericValue === undefined && state.edit.buffer?.type !== type}
            isActive={type === activeType}
            isDisabled={config.isDisabled}
            label={type === 'dayPeriod' ? translation('dayPeriod') : translation(timeUnitTranslationKey[type], { count: 1 })}
            min={type === 'dayPeriod' ? undefined : bounds.min}
            max={type === 'dayPeriod' ? undefined : bounds.max}
            valueNow={numericValue}
            segmentRef={registerSegment(type)}
            onKeyDown={onSegmentKeyDown}
            onFocus={(focused) => {
              if (state.edit.buffer && state.edit.buffer.type !== focused) {
                dispatch({ type: 'clearBuffer', focusedType: focused })
              } else {
                dispatch({ type: 'focus', focusedType: focused })
              }
            }}
          />
        )
      })}
    </div>
  )
})
