import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { UnknownTypeFilterContext } from './UnknownTypeFilterContext'
import { UnknownTypeFilterStateManager } from './UnknownTypeFilterStateManager'
import { UnknownTypeFilterOperator } from './UnknownTypeFilterOperator'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type UnknownTypeFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorUnknownType>, FilterEvent<FilterOperatorUnknownType>> & {
  operatorOverrides?: FilterOperatorUnknownType[],
}

const UnknownTypeFilterComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  operatorOverrides,
}: UnknownTypeFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorUnknownType>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'isNotUndefined',
      parameter: {},
    },
  })

  return (
    <UnknownTypeFilterStateManager
      state={valueBinding.store}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      operatorOverrides={operatorOverrides}
    >
      <UnknownTypeFilterOperator />
    </UnknownTypeFilterStateManager>
  )
}

export const UnknownTypeFilter = Object.assign(UnknownTypeFilterComponent, {
  StateManager: UnknownTypeFilterStateManager,
  Operator: UnknownTypeFilterOperator,
  Context: UnknownTypeFilterContext,
  Provider: UnknownTypeFilterContext.Provider,
  Consumer: UnknownTypeFilterContext.Consumer,
})
