import type { ComponentRef, ReactNode, Ref } from 'react'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
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
import { DateTimeInputStateManager, type DateTimeInputStateManagerProps } from './DateTimeInputStateManager'

export type DateTimeInputProps = Omit<DateTimeInputStateManagerProps, 'children'> & {
  allowRemove?: boolean,
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
  controlProps?: Omit<DateTimeInputControlProps, 'actions'>,
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
  allowClear,
  mode,
  precision,
  timeZone,
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
  return (
    <DateTimeInputStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      allowClear={allowClear}
      mode={mode}
      precision={precision}
      timeZone={timeZone}
      is24HourFormat={is24HourFormat}
    >
      <DateTimeInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <DateTimeInputControl
          {...controlProps}
          ref={ReactUtils.assingRefsBuilder([controlRef])}
          actions={actions}
        >
          <DateTimeInputField {...fieldProps} fieldRef={fieldRef} />
          <DateTimeInputActions actions={actions} />
        </DateTimeInputControl>
        <DateTimeInputPopup
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
