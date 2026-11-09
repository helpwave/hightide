import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { MultiTagsFilterContext } from './MultiTagsFilterContext'
import type { FilterTagOption } from './MultiTagsFilterContext'
import type { FilterOperatorTags } from '../../filter-operator'
import { MultiTagsFilterStateManager } from './MultiTagsFilterStateManager'
import { MultiTagsFilterOperator } from './MultiTagsFilterOperator'
import { MultiTagsFilterParameter } from './MultiTagsFilterParameter'
import { MultiTagsFilterLayout } from './MultiTagsFilterLayout'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type MultiTagsFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorTags>, FilterEvent<FilterOperatorTags>> & {
  tags?: ReadonlyArray<FilterTagOption>,
  operatorOverrides?: FilterOperatorTags[],
}

const MultiTagsFilterComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  tags,
  operatorOverrides,
}: MultiTagsFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorTags>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'contains',
      parameter: {},
    },
  })

  return (
    <MultiTagsFilterStateManager
      state={valueBinding.store}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      tags={tags}
      operatorOverrides={operatorOverrides}
    >
      <MultiTagsFilterLayout>
        <MultiTagsFilterOperator />
        <MultiTagsFilterParameter />
      </MultiTagsFilterLayout>
    </MultiTagsFilterStateManager>
  )
}

export const MultiTagsFilter = Object.assign(MultiTagsFilterComponent, {
  StateManager: MultiTagsFilterStateManager,
  Layout: MultiTagsFilterLayout,
  Operator: MultiTagsFilterOperator,
  Parameter: MultiTagsFilterParameter,
  Context: MultiTagsFilterContext,
  Provider: MultiTagsFilterContext.Provider,
  Consumer: MultiTagsFilterContext.Consumer,
})
