import { WheelPicker } from '../../selection/WheelPicker'
import { useDateWheelPickerContext } from './DateWheelPickerContext'

export function DateWheelPickerMonthWheel() {
  const { state, dispatch, config } = useDateWheelPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getMonth()}
      isLooping={config.isLooping}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      onValueChange={(month) => {
        if (!isLocked && month !== undefined) {
          dispatch({ type: 'setMonth', month })
        }
      }}
      onLoop={({ direction }) => {
        if (!isLocked) {
          dispatch({ type: 'loopMonth', direction })
        }
      }}
    >
      {config.months.map((month) => (
        <WheelPicker.Option key={month} value={month} valueId={String(month)}>
          {config.monthNames[month]}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}
