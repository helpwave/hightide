import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { SingleTagFilterContext } from './SingleTagFilterContext'
import type { FilterTagOption } from './SingleTagFilterContext'
import type { FilterOperatorTagsSingle } from '../../filter-operator'
import { SingleTagFilterStateManager } from './SingleTagFilterStateManager'
import { SingleTagFilterOperator } from './SingleTagFilterOperator'
import { SingleTagFilterParameter } from './SingleTagFilterParameter'
import { SingleTagFilterLayout } from './SingleTagFilterLayout'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type SingleTagFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorTagsSingle>, FilterEvent<FilterOperatorTagsSingle>> & {
  tags?: ReadonlyArray<FilterTagOption>,
  operatorOverrides?: FilterOperatorTagsSingle[],
}

const SingleTagFilterComponent = ({
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
}: SingleTagFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorTagsSingle>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'contains',
      parameter: {},
    },
  })

  return (
    <SingleTagFilterStateManager
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
      <SingleTagFilterLayout>
        <SingleTagFilterOperator />
        <SingleTagFilterParameter />
      </SingleTagFilterLayout>
    </SingleTagFilterStateManager>
  )
}

export const SingleTagFilter = Object.assign(SingleTagFilterComponent, {
  StateManager: SingleTagFilterStateManager,
  Layout: SingleTagFilterLayout,
  Operator: SingleTagFilterOperator,
  Parameter: SingleTagFilterParameter,
  Context: SingleTagFilterContext,
  Provider: SingleTagFilterContext.Provider,
  Consumer: SingleTagFilterContext.Consumer,
})
