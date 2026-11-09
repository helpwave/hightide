import type { ComponentRef, Ref } from 'react'
import { useMemo } from 'react'
import { useControllableStateStore } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { DateWheelPicker, type DateWheelPickerLayoutProps } from '../DateWheelPicker'
import { TimeWheelPicker, type TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { useDateTimeWheelPickerContext } from './DateTimeWheelPickerContext'

export type DateTimeWheelPickerWheelsProps = {
  dateWheelPickerRef?: Ref<ComponentRef<typeof DateWheelPicker.Layout>>,
  dateWheelPickerProps?: DateWheelPickerLayoutProps,
  timeWheelPickerRef?: Ref<ComponentRef<typeof TimeWheelPicker.Layout>>,
  timeWheelPickerProps?: TimeWheelPickerLayoutProps,
}

export function DateTimeWheelPickerWheels({
  dateWheelPickerRef,
  dateWheelPickerProps,
  timeWheelPickerRef,
  timeWheelPickerProps,
}: DateTimeWheelPickerWheelsProps) {
  const { state, dispatch, config } = useDateTimeWheelPickerContext()
  const onStateChange = (next: { value: Date }) => {
    dispatch({ type: 'setValue', value: next.value })
  }
  const pickerState = useMemo(() => ({ value: state.value }), [state.value])
  const datePicker = useControllableStateStore({
    state: pickerState,
    onStateChange,
  })
  const timePicker = useControllableStateStore({
    state: pickerState,
    onStateChange,
  })

  return (
    <>
      <DateWheelPicker.StateManager
        state={datePicker.store}
        onStateChange={datePicker.onStateChange}
        isInvalid={config.isInvalid}
        isDisabled={config.isDisabled}
        isReadOnly={config.isReadOnly}
        isRequired={config.isRequired}
        start={config.start}
        end={config.end}
        isLooping={config.isLooping}
        loopingBehaviour={config.loopingBehaviour}
      >
        <DateWheelPicker.Layout
          {...dateWheelPickerProps}
          ref={ReactUtils.assingRefsBuilder([dateWheelPickerRef])}
        >
          <DateWheelPicker.DayWheel />
          <DateWheelPicker.MonthWheel />
          <DateWheelPicker.YearWheel />
        </DateWheelPicker.Layout>
      </DateWheelPicker.StateManager>
      <TimeWheelPicker.StateManager
        state={timePicker.store}
        onStateChange={timePicker.onStateChange}
        isInvalid={config.isInvalid}
        isDisabled={config.isDisabled}
        isReadOnly={config.isReadOnly}
        isRequired={config.isRequired}
        is24HourFormat={config.is24HourFormat}
        isLooping={config.isLooping}
        loopingBehaviour={config.loopingBehaviour}
        minuteIncrement={config.minuteIncrement}
        secondIncrement={config.secondIncrement}
        millisecondIncrement={config.millisecondIncrement}
        precision={config.precision}
      >
        <TimeWheelPicker.Layout
          {...timeWheelPickerProps}
          ref={ReactUtils.assingRefsBuilder([timeWheelPickerRef])}
        >
          <TimeWheelPicker.Wheel unit="hour" />
          <TimeWheelPicker.Separator symbol=":" />
          <TimeWheelPicker.Wheel unit="minute" />
          <TimeWheelPicker.Separator symbol=":" unit="second" />
          <TimeWheelPicker.Wheel unit="second" />
          <TimeWheelPicker.Separator symbol="." unit="millisecond" />
          <TimeWheelPicker.Wheel unit="millisecond" />
          <TimeWheelPicker.Period />
        </TimeWheelPicker.Layout>
      </TimeWheelPicker.StateManager>
    </>
  )
}
