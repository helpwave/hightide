import { forwardRef, useCallback } from 'react'
import { UnknownTypeFilter } from '../data-input/UnknownTypeFilter'
import { useFilterState, type FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorUnknownType } from '../filter-operator'
import { FilterOperatorUtils } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const GenericFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function GenericFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'isNotUndefined'
  const operator = FilterOperatorUtils.typeCheck.unknownType(suggestion) ? suggestion : 'isNotUndefined'
  const typedValue: FilterInputValue<FilterOperatorUnknownType> = { operator, parameter: {} }
  const binding = useFilterState<FilterOperatorUnknownType>({
    value: typedValue,
    onValueChange: useCallback((next: FilterInputValue<FilterOperatorUnknownType>) => {
      onValueChange({
        dataType: 'unknownType',
        operator: next.operator,
        parameter: {},
      })
    }, [onValueChange]),
    defaultValue: typedValue,
  })

  return (
    <UnknownTypeFilter.StateManager
      state={binding.store}
      onStateChange={binding.onStateChange}
      operatorOverrides={operatorOverrides}
    >
      <FilterPopUpShell
        ref={ref}
        {...props}
        name={name}
        onRemove={onRemove}
        operator={<UnknownTypeFilter.Operator />}
      />
    </UnknownTypeFilter.StateManager>
  )
})
