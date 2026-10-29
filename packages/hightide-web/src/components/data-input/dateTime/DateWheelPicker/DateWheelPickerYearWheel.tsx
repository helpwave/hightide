import { WheelPicker } from '../../../interaction/WheelPicker'
import { useDateWheelPickerContext } from './DateWheelPickerContext'

export function DateWheelPickerYearWheel() {
  const { state, dispatch, config } = useDateWheelPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getFullYear()}
      isLooping={config.isLooping}
      disabled={isLocked}
      onValueChange={(year) => {
        if (!isLocked) {
          dispatch({ type: 'setYear', year })
        }
      }}
    >
      {config.years.map((year) => (
        <WheelPicker.Option key={year} value={year} valueId={String(year)}>
          {String(year)}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}
