import { WheelPicker } from '../../selection/WheelPicker'
import { useYearMonthPickerContext } from './YearMonthPickerContext'

export function YearMonthPickerMonthWheel() {
  const { state, dispatch, config } = useYearMonthPickerContext()
  const isLocked = config.isDisabled || config.isReadOnly

  return (
    <WheelPicker
      value={state.value.getMonth()}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      onValueChange={(month) => {
        if (!isLocked && month !== null) {
          dispatch({ type: 'setMonth', month })
        }
      }}
      options={config.months.map((month) => ({
        value: month,
        id: String(month),
        label: config.monthNames[month] ?? String(month),
      }))}
    />
  )
}
