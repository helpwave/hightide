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
        if (!isLocked && year !== undefined) {
          dispatch({ type: 'setYear', year })
        }
      }}
    >
      {config.years.map((year) => (
        <WheelPicker.Option key={year} value={year} valueId={String(year)}>
          {year}
        </WheelPicker.Option>
      ))}
    </WheelPicker>
  )
}
