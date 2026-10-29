import type { ComponentRef, ReactNode, Ref } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { DateTimeFormat, DateTimePrecision, Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { DateWheelPickerLayout, DateWheelPickerLayoutProps } from '../DateWheelPicker'
import type { TimeWheelPickerLayout, TimeWheelPickerLayoutProps, WheelLoopingBehaviour } from '../TimeWheelPicker'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { DateTimePickerDialogContext } from './DateTimePickerDialogContext'
import { DateTimePickerDialogActions, type DateTimePickerDialogActionsProps } from './DateTimePickerDialogActions'
import { DateTimePickerDialogBody, type DateTimePickerDialogBodyProps } from './DateTimePickerDialogBody'
import { DateTimePickerDialogHeader, type DateTimePickerDialogHeaderProps } from './DateTimePickerDialogHeader'
import { DateTimePickerDialogLayout, type DateTimePickerDialogLayoutProps } from './DateTimePickerDialogLayout'
import { DateTimePickerDialogStateManager } from './DateTimePickerDialogStateManager'
import type {
  DateTimePickerDialogEvent,
  DateTimePickerDialogState
} from './DateTimePickerDialogState'

export type DateTimePickerDialogProps = ControllableInputProps<Date | null, DateTimePickerDialogEvent> & {
  allowRemove?: boolean,
  mode?: DateTimeFormat,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  precision?: DateTimePrecision,
  label?: ReactNode,
  labelId?: string,
  layoutRef?: Ref<ComponentRef<typeof DateTimePickerDialogLayout>>,
  layoutProps?: DateTimePickerDialogLayoutProps,
  headerRef?: Ref<ComponentRef<typeof DateTimePickerDialogHeader>>,
  headerProps?: DateTimePickerDialogHeaderProps,
  bodyRef?: Ref<ComponentRef<typeof DateTimePickerDialogBody>>,
  bodyProps?: DateTimePickerDialogBodyProps,
  actionsRef?: Ref<ComponentRef<typeof DateTimePickerDialogActions>>,
  actionsProps?: DateTimePickerDialogActionsProps,
  dateWheelPickerRef?: Ref<ComponentRef<typeof DateWheelPickerLayout>>,
  dateWheelPickerProps?: DateWheelPickerLayoutProps,
  timeWheelPickerRef?: Ref<ComponentRef<typeof TimeWheelPickerLayout>>,
  timeWheelPickerProps?: TimeWheelPickerLayoutProps,
}

const DateTimePickerDialogComponent = ({
  value,
  initialValue = null,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  allowRemove,
  mode,
  start,
  end,
  weekStart,
  markToday,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  label,
  labelId,
  layoutRef,
  layoutProps,
  headerRef,
  headerProps,
  bodyRef,
  bodyProps,
  actionsRef,
  actionsProps,
  dateWheelPickerRef,
  dateWheelPickerProps,
  timeWheelPickerRef,
  timeWheelPickerProps,
}: DateTimePickerDialogProps) => {
  const resolvedValue = value === undefined ? initialValue : value
  const [state, setState] = useControlledState<DateTimePickerDialogState>({
    defaultValue: {
      value: resolvedValue,
      pickerValue: resolvedValue ?? new Date(),
      step: 'date',
    },
  })
  const binding = useStateMachineBinding<DateTimePickerDialogState, Date | null>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: Date | null) => ({ value: next }), []),
    get: useCallback((current: DateTimePickerDialogState) => current.value, []),
  })
  const valueTime = value === undefined ? undefined : value === null ? null : value.getTime()
  const previousTimeRef = useRef(valueTime)

  useEffect(() => {
    if (value === undefined || Object.is(previousTimeRef.current, valueTime)) {
      return
    }
    previousTimeRef.current = valueTime
    setState((current) => ({
      ...current,
      value,
      pickerValue: value ?? current.pickerValue,
    }))
  }, [setState, value, valueTime])

  return (
    <DateTimePickerDialogStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      mode={mode}
      allowRemove={allowRemove}
      label={label}
      labelId={labelId}
      start={start}
      end={end}
      weekStart={weekStart}
      markToday={markToday}
      isLooping={isLooping}
      loopingBehaviour={loopingBehaviour}
      is24HourFormat={is24HourFormat}
      minuteIncrement={minuteIncrement}
      secondIncrement={secondIncrement}
      millisecondIncrement={millisecondIncrement}
      precision={precision}
    >
      <DateTimePickerDialogLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <DateTimePickerDialogHeader
          ref={ReactUtils.assingRefsBuilder([headerRef])}
          {...headerProps}
        />
        <DateTimePickerDialogBody
          ref={ReactUtils.assingRefsBuilder([bodyRef])}
          dateWheelPickerRef={dateWheelPickerRef}
          dateWheelPickerProps={dateWheelPickerProps}
          timeWheelPickerRef={timeWheelPickerRef}
          timeWheelPickerProps={timeWheelPickerProps}
          {...bodyProps}
        />
        <DateTimePickerDialogActions
          ref={ReactUtils.assingRefsBuilder([actionsRef])}
          {...actionsProps}
        />
      </DateTimePickerDialogLayout>
    </DateTimePickerDialogStateManager>
  )
}

export const DateTimePickerDialog = Object.assign(DateTimePickerDialogComponent, {
  StateManager: DateTimePickerDialogStateManager,
  Layout: DateTimePickerDialogLayout,
  Header: DateTimePickerDialogHeader,
  Body: DateTimePickerDialogBody,
  Actions: DateTimePickerDialogActions,
  Context: DateTimePickerDialogContext,
  Provider: DateTimePickerDialogContext.Provider,
  Consumer: DateTimePickerDialogContext.Consumer,
})
