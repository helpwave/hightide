import { forwardRef, useCallback } from 'react'
import { NumberFilter } from '../data-input/NumberFilter'
import type { FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorNumber } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const NumberFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function NumberFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'between'
  const operator = FilterOperatorUtils.typeCheck.number(suggestion) ? suggestion : 'between'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorNumber> = { operator, parameter }
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorNumber>) => {
    onValueChange({
      dataType: 'number',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  return (
    <NumberFilter.StateManager
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
        operator={<NumberFilter.Operator />}
      >
        <NumberFilter.Parameter />
      </FilterPopUpShell>
    </NumberFilter.StateManager>
  )
})
