import { forwardRef, useCallback, type ReactNode } from 'react'
import { SingleTagFilter } from '../data-input/SingleTagFilter'
import type { FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorTagsSingle } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export interface TagsSingleFilterPopUpProps extends FilterPopUpProps {
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export const TagsSingleFilterPopUp = forwardRef<HTMLDivElement, TagsSingleFilterPopUpProps>(function TagsSingleFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  tags,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'contains'
  const operator = FilterOperatorUtils.typeCheck.tagsSingle(suggestion) ? suggestion : 'contains'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorTagsSingle> = { operator, parameter }
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorTagsSingle>) => {
    onValueChange({
      dataType: 'singleTag',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  if (tags.length === 0) {
    return null
  }

  return (
    <SingleTagFilter.StateManager
      value={typedValue}
      onValueChange={changeValue}
      tags={tags}
      operatorOverrides={operatorOverrides}
    >
      <FilterPopUpShell
        ref={ref}
        {...props}
        name={name}
        onRemove={onRemove}
        noParameterRequired={!operatorNeedsParameter(operator)}
        operator={<SingleTagFilter.Operator />}
      >
        <SingleTagFilter.Parameter />
      </FilterPopUpShell>
    </SingleTagFilter.StateManager>
  )
})
