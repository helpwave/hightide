import { forwardRef, useCallback } from 'react'
import { TextFilter } from '../data-input/TextFilter'
import type { FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorText } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export const TextFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function TextFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'contains'
  const operator = FilterOperatorUtils.typeCheck.text(suggestion) ? suggestion : 'contains'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorText> = { operator, parameter }
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorText>) => {
    onValueChange({
      dataType: 'text',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  return (
    <TextFilter.StateManager
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
        operator={<TextFilter.Operator />}
      >
        <TextFilter.Parameter />
      </FilterPopUpShell>
    </TextFilter.StateManager>
  )
})
