import { WheelPicker } from '../../selection/WheelPicker'
import { useDateWheelPickerContext } from './DateWheelPickerContext'

export function DateWheelPickerYearWheel() {
  const { state, dispatch, config } = useDateWheelPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getFullYear()}
      isLooping={config.isLooping}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      onValueChange={(year) => {
        if (!isLocked && year !== null) {
          dispatch({ type: 'setYear', year })
        }
      }}
      options={config.years.map((year) => ({
        value: year,
        id: String(year),
        label: String(year),
      }))}
    />
  )
}
