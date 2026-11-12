import { forwardRef, useCallback, type ReactNode } from 'react'
import { MultiTagsFilter } from '../data-input/MultiTagsFilter'
import type { FilterInputValue } from '../data-input/filter-value'
import type { FilterOperatorTags } from '../filter-operator'
import { FilterOperatorUtils, operatorNeedsParameter } from '../filter-operator'
import { FilterPopUpShell } from './FilterBasePopUp'
import type { FilterPopUpProps } from './FilterPopUpProps'

export interface TagsFilterPopUpProps extends FilterPopUpProps {
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export const TagsFilterPopUp = forwardRef<HTMLDivElement, TagsFilterPopUpProps>(function TagsFilterPopUp({
  name,
  value,
  onValueChange,
  onRemove,
  tags,
  operatorOverrides,
  ...props
}, ref) {
  const suggestion = value?.operator ?? 'contains'
  const operator = FilterOperatorUtils.typeCheck.tags(suggestion) ? suggestion : 'contains'
  const parameter = value?.parameter ?? {}
  const typedValue: FilterInputValue<FilterOperatorTags> = { operator, parameter }
  const changeValue = useCallback((next: FilterInputValue<FilterOperatorTags>) => {
    onValueChange({
      dataType: 'multiTags',
      operator: next.operator,
      parameter: next.parameter,
    })
  }, [onValueChange])

  if (tags.length === 0) {
    return null
  }

  return (
    <MultiTagsFilter.StateManager
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
        operator={<MultiTagsFilter.Operator />}
      >
        <MultiTagsFilter.Parameter />
      </FilterPopUpShell>
    </MultiTagsFilter.StateManager>
  )
})
