import type { ComponentRef, Ref } from 'react'
import { useCallback, useMemo } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { buildSegmentLayout, decomposeDate } from '../dateTimeSegments'
import { DateTimeFieldContext } from './DateTimeFieldContext'
import { DateTimeFieldLayout, type DateTimeFieldLayoutProps } from './DateTimeFieldLayout'
import { DateTimeFieldStateManager } from './DateTimeFieldStateManager'
import type { DateTimeFieldEvent, DateTimeFieldState } from './DateTimeFieldState'

export type DateTimeFieldProps = ControllableInputProps<Date | null, DateTimeFieldEvent> & {
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
  is24HourFormat?: boolean,
  locale?: string,
  layoutRef?: Ref<ComponentRef<typeof DateTimeFieldLayout>>,
  layoutProps?: DateTimeFieldLayoutProps,
}

const DateTimeFieldComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  mode = 'date',
  precision = 'minute',
  is24HourFormat,
  locale: localeOverride,
  layoutRef,
  layoutProps,
}: DateTimeFieldProps) => {
  const { locale: contextLocale, is24HourFormat: contextIs24HourFormat } = useLocalization()
  const locale = localeOverride ?? contextLocale
  const is24Hour = is24HourFormat ?? contextIs24HourFormat ?? true
  const initialLayout = useMemo(
    () => buildSegmentLayout({ locale, mode, precision, is24HourFormat: is24Hour }),
    [is24Hour, locale, mode, precision]
  )
  const [state, setState] = useControlledState<DateTimeFieldState>({
    defaultValue: {
      value: initialValue ?? null,
      edit: {
        values: initialValue ? decomposeDate(initialValue, initialLayout, is24Hour) : {},
        buffer: null,
      },
      focusedType: null,
    },
  })
  const binding = useStateMachineBinding<DateTimeFieldState, Date | null>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: Date | null) => ({ value: next }), []),
    get: useCallback((current: DateTimeFieldState) => current.value, []),
  })

  return (
    <DateTimeFieldStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      locale={locale}
      is24HourFormat={is24Hour}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <DateTimeFieldLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        mode={mode}
        precision={precision}
      />
    </DateTimeFieldStateManager>
  )
}

export const DateTimeField = Object.assign(DateTimeFieldComponent, {
  StateManager: DateTimeFieldStateManager,
  Layout: DateTimeFieldLayout,
  Context: DateTimeFieldContext,
  Provider: DateTimeFieldContext.Provider,
  Consumer: DateTimeFieldContext.Consumer,
})
