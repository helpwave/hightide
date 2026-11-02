import { WheelPicker } from '../../selection/WheelPicker'
import { useDateWheelPickerContext } from './DateWheelPickerContext'

export function DateWheelPickerDayWheel() {
  const { state, dispatch, config } = useDateWheelPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getDate()}
      isLooping={config.isLooping}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      onValueChange={(day) => {
        if (!isLocked && day !== undefined) {
          dispatch({ type: 'setDay', day })
        }
      }}
      onLoop={({ direction }) => {
        if (!isLocked) {
          dispatch({ type: 'loopDay', direction })
        }
      }}
    >
      {config.days.map((day) => (
        <WheelPicker.Option key={day} value={day} valueId={String(day)}>
          {String(day).padStart(2, '0')}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}
