import { forwardRef, useCallback } from 'react'
import { DateFilter } from '../data-input/DateFilter'
import { useFilterState, type FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorDate } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const DateFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function DateFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'between'
  const operator = FilterOperatorUtils.typeCheck.date(suggestion) ? suggestion : 'between'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorDate> = { operator, parameter }
  const binding = useFilterState<FilterOperatorDate>({
    value: typedValue,
    onValueChange: useCallback((next: FilterInputValue<FilterOperatorDate>) => {
      onValueChange({
        dataType: 'date',
        operator: next.operator,
        parameter: next.parameter,
      })
    }, [onValueChange]),
    defaultValue: typedValue,
  })

  return (
    <DateFilter.StateManager
      state={binding.store}
      onStateChange={binding.onStateChange}
      operatorOverrides={operatorOverrides}
    >
      <FilterPopUpShell
        ref={ref}
        {...props}
        name={name}
        onRemove={onRemove}
        noParameterRequired={!operatorNeedsParameter(binding.state.value.operator)}
        operator={<DateFilter.Operator />}
      >
        <DateFilter.Parameter />
      </FilterPopUpShell>
    </DateFilter.StateManager>
  )
})
