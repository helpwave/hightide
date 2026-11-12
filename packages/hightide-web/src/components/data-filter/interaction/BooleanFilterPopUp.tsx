import { forwardRef, useCallback } from 'react'
import { BooleanFilter } from '../data-input/BooleanFilter'
import type { FilterInputValue } from '../data-input/filter-value'
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
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorBoolean>) => {
    onValueChange({
      dataType: 'boolean',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  return (
    <BooleanFilter.StateManager
      value={typedValue}
      onValueChange={changeValue}
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
