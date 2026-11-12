import { forwardRef, useCallback } from 'react'
import { DateTimeFilter } from '../data-input/DateTimeFilter'
import type { FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorDatetime } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const DatetimeFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function DatetimeFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'between'
  const operator = FilterOperatorUtils.typeCheck.datetime(suggestion) ? suggestion : 'between'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorDatetime> = { operator, parameter }
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorDatetime>) => {
    onValueChange({
      dataType: 'dateTime',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  return (
    <DateTimeFilter.StateManager
      value={typedValue}
      onValueChange={changeValue}
      operatorOverrides={operatorOverrides}
    >
      <FilterPopUpShell
        ref={ref}
        {...props}
        name={name}
        onRemove={onRemove}
        noParameterRequired={!operatorNeedsParameter(operator)}
        operator={<DateTimeFilter.Operator />}
      >
        <DateTimeFilter.Parameter />
      </FilterPopUpShell>
    </DateTimeFilter.StateManager>
  )
})
