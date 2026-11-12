import { forwardRef, useCallback } from 'react'
import { UnknownTypeFilter } from '../data-input/UnknownTypeFilter'
import type { FilterInputValue } from '../data-input/filter-value'
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
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorUnknownType>) => {
    onValueChange({
      dataType: 'unknownType',
      operator: next.operator,
      parameter: {},
    })
  }, [onValueChange])

  return (
    <UnknownTypeFilter.StateManager
      value={typedValue}
      onValueChange={changeValue}
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
