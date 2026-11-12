import { useId, useMemo, useRef } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { useDateTimeFormat, useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { DateTimeInputContext, type DateTimeInputContextValue } from './DateTimeInputContext'
import { dateTimeInputStateTransition, type DateTimeInputEvent, type DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputStateManagerProps = DOMInputStateManagerProps<DateTimeInputState, DateTimeInputEvent> & {
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
  timeZone?: string,
  is24HourFormat?: boolean,
  allowClear?: boolean,
}

export function DateTimeInputStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  mode = 'date',
  precision = 'minute',
  timeZone: timeZoneOverride,
  is24HourFormat: is24HourFormatOverride,
  allowClear = true,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: DateTimeInputStateManagerProps) {
  const { timeZone: contextTimeZone } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const generatedId = useId()
  const ids = useMemo(() => ({
    popup: `date-time-input-popup-${generatedId}`,
    label: `date-time-input-label-${generatedId}`,
  }), [generatedId])
  const anchorRef = useRef<HTMLDivElement>(null)
  const hasClear = !isRequired && allowClear && !isReadOnly && !isDisabled
  const hasTimePicker = !isReadOnly && !isDisabled
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => ({
      value: seeded ?? null,
      dialogValue: seeded ?? null,
      isOpen: false,
    }),
    transition: dateTimeInputStateTransition,
    onStateChange,
    onStateEvent,
  })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<DateTimeInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    mode,
    precision,
    timeZone,
    is24HourFormat,
    hasClear,
    hasTimePicker,
    ids,
    anchorRef,
  }), [anchorRef, config, hasClear, hasTimePicker, ids, is24HourFormat, machine.dispatch, machine.state, mode, precision, timeZone])

  return (
    <DateTimeInputContext.Provider value={contextValue}>
      {children}
    </DateTimeInputContext.Provider>
  )
}
