import { WheelPicker } from '../../selection/WheelPicker'
import { useYearMonthPickerContext } from './YearMonthPickerContext'

export function YearMonthPickerYearWheel() {
  const { state, dispatch, config } = useYearMonthPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getFullYear()}
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
