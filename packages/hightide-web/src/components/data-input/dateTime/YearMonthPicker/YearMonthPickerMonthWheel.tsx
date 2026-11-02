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
        if (!isLocked && month !== undefined) {
          dispatch({ type: 'setMonth', month })
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
