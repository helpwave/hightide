import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TimeWheelPicker, type TimeWheelPickerLayoutProps } from '../TimeWheelPicker'
import { useDateTimePickerContext } from './DateTimePickerContext'

export type DateTimePickerTimeProps = {
  layoutRef?: Ref<ComponentRef<typeof TimeWheelPicker.Layout>>,
  layoutProps?: TimeWheelPickerLayoutProps,
}

export function DateTimePickerTime({
  layoutRef,
  layoutProps,
}: DateTimePickerTimeProps) {
  const { state, dispatch, config } = useDateTimePickerContext()

  return (
    <TimeWheelPicker.StateManager
      state={{ value: state.value }}
      onStateChange={(next) => dispatch({ type: 'setValue', value: next.value })}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      is24HourFormat={config.is24HourFormat}
      minuteIncrement={config.minuteIncrement}
      secondIncrement={config.secondIncrement}
      millisecondIncrement={config.millisecondIncrement}
      precision={config.precision}
    >
      <TimeWheelPicker.Layout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
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
  )
}
