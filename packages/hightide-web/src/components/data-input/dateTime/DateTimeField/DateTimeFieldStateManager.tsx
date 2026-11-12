import { useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { buildSegmentLayout, decomposeDate } from '../dateTimeSegments'
import { DateTimeFieldContext, type DateTimeFieldContextValue } from './DateTimeFieldContext'
import { dateTimeFieldStateTransition, type DateTimeFieldEvent, type DateTimeFieldState } from './DateTimeFieldState'

export type DateTimeFieldStateManagerProps = DOMInputStateManagerProps<DateTimeFieldState, DateTimeFieldEvent> & {
  locale?: string,
  is24HourFormat?: boolean,
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
}

export function DateTimeFieldStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  locale: localeOverride,
  is24HourFormat: is24HourFormatOverride,
  mode = 'date',
  precision = 'minute',
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: DateTimeFieldStateManagerProps) {
  const { locale: contextLocale, is24HourFormat: contextIs24HourFormat } = useLocalization()
  const locale = localeOverride ?? contextLocale
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat ?? true
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => {
      const resolved = seeded ?? null
      const layout = buildSegmentLayout({ locale, mode, precision, is24HourFormat })
      return {
        value: resolved,
        edit: {
          values: resolved ? decomposeDate(resolved, layout, is24HourFormat) : {},
          buffer: null,
        },
        focusedType: null,
      }
    },
    transition: dateTimeFieldStateTransition,
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
  const contextValue = useMemo<DateTimeFieldContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    locale,
    is24HourFormat,
    mode,
    precision,
  }), [config, machine.dispatch, is24HourFormat, locale, machine.state, mode, precision])

  return (
    <DateTimeFieldContext.Provider value={contextValue}>
      {children}
    </DateTimeFieldContext.Provider>
  )
}
