import { forwardRef, useCallback } from 'react'
import { BooleanFilter } from '../data-input/BooleanFilter'
import { useFilterState, type FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorBoolean } from '../filter-operator'
import { FilterOperatorUtils } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const BooleanFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function BooleanFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'isTrue'
  const operator = FilterOperatorUtils.typeCheck.boolean(suggestion) ? suggestion : 'isTrue'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorBoolean> = { operator, parameter }
  const binding = useFilterState<FilterOperatorBoolean>({
    value: typedValue,
    onValueChange: useCallback((next: FilterInputValue<FilterOperatorBoolean>) => {
      onValueChange({
        dataType: 'boolean',
        operator: next.operator,
        parameter: next.parameter,
      })
    }, [onValueChange]),
    defaultValue: typedValue,
  })

  return (
    <BooleanFilter.StateManager
      state={binding.store}
      onStateChange={binding.onStateChange}
      operatorOverrides={operatorOverrides}
    >
      <FilterPopUpShell
        ref={ref}
        {...props}
        name={name}
        onRemove={onRemove}
        operator={<BooleanFilter.Operator />}
      />
    </BooleanFilter.StateManager>
  )
})
