import clsx from 'clsx'
import type { ComponentRef, HTMLAttributes, Ref } from 'react'
import { forwardRef, useMemo } from 'react'
import { useControllableStateStore } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { DateWheelPicker, type DateWheelPickerLayoutProps } from '../DateWheelPicker'
import { TimeWheelPicker, type TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { useDateTimePickerDialogChrome, useDateTimePickerDialogContext } from './DateTimePickerDialogContext'

export type DateTimePickerDialogBodyProps = HTMLAttributes<HTMLDivElement> & {
  dateWheelPickerRef?: Ref<ComponentRef<typeof DateWheelPicker.Layout>>,
  dateWheelPickerProps?: DateWheelPickerLayoutProps,
  timeWheelPickerRef?: Ref<ComponentRef<typeof TimeWheelPicker.Layout>>,
  timeWheelPickerProps?: TimeWheelPickerLayoutProps,
}

export const DateTimePickerDialogBody = forwardRef<HTMLDivElement, DateTimePickerDialogBodyProps>(function DateTimePickerDialogBody({
  dateWheelPickerRef,
  dateWheelPickerProps,
  timeWheelPickerRef,
  timeWheelPickerProps,
  ...props
}, forwardedRef) {
  const { state, dispatch, config } = useDateTimePickerDialogContext()
  const { isSplit, pairRef } = useDateTimePickerDialogChrome()
  const isDateShown = config.mode !== 'time' && (!isSplit || state.step === 'date')
  const isTimeShown = config.mode !== 'date' && (!isSplit || state.step === 'time')
  const onStateChange = (next: { value: Date }) => {
    dispatch({ type: 'pick', value: next.value })
  }
  const pickerState = useMemo(() => ({ value: state.pickerValue }), [state.pickerValue])
  const datePicker = useControllableStateStore({
    state: pickerState,
    onStateChange,
  })
  const timePicker = useControllableStateStore({
    state: pickerState,
    onStateChange,
  })

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([forwardedRef, pairRef])}
      className={clsx('date-time-picker-dialog-pair', props.className)}
    >
      {isDateShown && (
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
      )}
      {isTimeShown && (
        <TimeWheelPicker.StateManager
          state={timePicker.store}
          onStateChange={timePicker.onStateChange}
          isInvalid={config.isInvalid}
          isDisabled={config.isDisabled}
          isReadOnly={config.isReadOnly}
          isRequired={config.isRequired}
          isLooping={config.isLooping}
          loopingBehaviour={config.loopingBehaviour}
          is24HourFormat={config.is24HourFormat}
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
      )}
    </div>
  )
})
