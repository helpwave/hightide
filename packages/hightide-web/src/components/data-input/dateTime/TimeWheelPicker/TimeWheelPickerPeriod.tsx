import { WheelPicker } from '../../selection/WheelPicker'
import { useTimeWheelPickerContext } from './TimeWheelPickerContext'

export function TimeWheelPickerPeriod() {
  const { state, dispatch, config } = useTimeWheelPickerContext()
  if (config.is24HourFormat) {
    return null
  }
  const period = state.value.getHours() >= 12 ? 'pm' : 'am'
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker<'am' | 'pm'>
      value={period}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      onValueChange={(nextPeriod) => {
        if (!isLocked && nextPeriod !== undefined) {
          dispatch({ type: 'setPeriod', period: nextPeriod })
        }
      }}
    >
      <WheelPicker.Option value="am">AM</WheelPicker.Option>
      <WheelPicker.Option value="pm">PM</WheelPicker.Option>
    </WheelPicker>
  )
}
