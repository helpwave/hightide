import type { ComponentRef, ReactNode, Ref, RefObject } from 'react'
import { useCallback, useId, useMemo, useRef } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useDateTimeFormat, useLocalization } from '../../../../global-contexts/localization/forward-exports'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { DateTimeInputActions } from './DateTimeInputActions'
import { DateTimeInputContext } from './DateTimeInputContext'
import { DateTimeInputControl, type DateTimeInputControlProps } from './DateTimeInputControl'
import { DateTimeInputField, type DateTimeInputFieldProps } from './DateTimeInputField'
import { DateTimeInputLayout, type DateTimeInputLayoutProps } from './DateTimeInputLayout'
import { DateTimeInputPopup, type DateTimeInputPopupProps } from './DateTimeInputPopup'
import { DateTimeInputStateManager } from './DateTimeInputStateManager'
import type { DateTimeInputEvent, DateTimeInputState } from './DateTimeInputState'

export type DateTimeInputProps = ControllableDOMInputProps<Date | null, DateTimeInputEvent> & {
  allowRemove?: boolean,
  allowClear?: boolean,
  mode?: DateTimeFormat,
  precision?: DateTimePrecision,
  timeZone?: string,
  is24HourFormat?: boolean,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  outsideClickCloses?: boolean,
  actions?: ReactNode[],
  pickerProps?: DateTimeInputPopupProps['pickerProps'],
  layoutRef?: Ref<ComponentRef<typeof DateTimeInputLayout>>,
  layoutProps?: DateTimeInputLayoutProps,
  controlRef?: Ref<ComponentRef<typeof DateTimeInputControl>>,
  controlProps?: Omit<DateTimeInputControlProps, 'actionCount'>,
  fieldRef?: DateTimeInputFieldProps['fieldRef'],
  fieldProps?: Omit<DateTimeInputFieldProps, 'fieldRef'>,
}

const DateTimeInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  allowRemove = false,
  allowClear = true,
  mode = 'date',
  precision = 'minute',
  timeZone: timeZoneOverride,
  is24HourFormat,
  start,
  end,
  weekStart,
  markToday,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  outsideClickCloses = true,
  actions = [],
  pickerProps,
  layoutRef,
  layoutProps,
  controlRef,
  controlProps,
  fieldRef,
  fieldProps,
}: DateTimeInputProps) => {
  const { timeZone: contextTimeZone } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat } = useDateTimeFormat()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const resolvedIs24HourFormat = is24HourFormat ?? contextIs24HourFormat
  const generatedId = useId()
  const ids = useMemo(() => ({
    popup: `date-time-input-popup-${generatedId}`,
    label: `date-time-input-label-${generatedId}`,
  }), [generatedId])
  const anchorRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useControlledState<DateTimeInputState>({
    defaultValue: {
      value: initialValue ?? null,
      dialogValue: initialValue ?? null,
      isOpen: false,
    },
  })
  const binding = useStateMachineBinding<DateTimeInputState, Date | null>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: Date | null) => ({ value: next }), []),
    get: useCallback((current: DateTimeInputState) => current.value, []),
  })
  const hasClear = !isRequired && allowClear && !isReadOnly && !isDisabled && binding.state.value !== null
  const hasTimePicker = !isReadOnly
  const actionCount = actions.length + (hasClear ? 1 : 0) + (hasTimePicker ? 1 : 0)

  return (
    <DateTimeInputStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      mode={mode}
      precision={precision}
      timeZone={timeZone}
      is24HourFormat={resolvedIs24HourFormat}
      hasClear={hasClear}
      hasTimePicker={hasTimePicker}
    >
      <DateTimeInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <DateTimeInputControl
          {...controlProps}
          ref={ReactUtils.assingRefsBuilder([anchorRef, controlRef])}
          actionCount={actionCount}
        >
          <DateTimeInputField {...fieldProps} fieldRef={fieldRef} />
          <DateTimeInputActions actions={actions} popupId={ids.popup} />
        </DateTimeInputControl>
        <DateTimeInputPopup
          popupId={ids.popup}
          labelId={ids.label}
          anchor={anchorRef as RefObject<HTMLDivElement | null>}
          outsideClickCloses={outsideClickCloses}
          allowRemove={allowRemove}
          start={start}
          end={end}
          weekStart={weekStart}
          markToday={markToday}
          minuteIncrement={minuteIncrement}
          secondIncrement={secondIncrement}
          millisecondIncrement={millisecondIncrement}
          pickerProps={pickerProps}
        />
      </DateTimeInputLayout>
    </DateTimeInputStateManager>
  )
}

export const DateTimeInput = Object.assign(DateTimeInputComponent, {
  StateManager: DateTimeInputStateManager,
  Layout: DateTimeInputLayout,
  Control: DateTimeInputControl,
  Field: DateTimeInputField,
  Actions: DateTimeInputActions,
  Popup: DateTimeInputPopup,
  Context: DateTimeInputContext,
  Provider: DateTimeInputContext.Provider,
  Consumer: DateTimeInputContext.Consumer,
})
