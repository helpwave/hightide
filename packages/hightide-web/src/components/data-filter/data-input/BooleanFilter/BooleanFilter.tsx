import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { BooleanFilterContext } from './BooleanFilterContext'
import { BooleanFilterStateManager } from './BooleanFilterStateManager'
import { BooleanFilterOperator } from './BooleanFilterOperator'
import type { FilterOperatorBoolean } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type BooleanFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorBoolean>, FilterEvent<FilterOperatorBoolean>> & {
  operatorOverrides?: FilterOperatorBoolean[],
}

const BooleanFilterComponent = ({
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
}: BooleanFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorBoolean>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'isTrue',
      parameter: {},
    },
  })

  return (
    <BooleanFilterStateManager
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
      <BooleanFilterOperator />
    </BooleanFilterStateManager>
  )
}

export const BooleanFilter = Object.assign(BooleanFilterComponent, {
  StateManager: BooleanFilterStateManager,
  Operator: BooleanFilterOperator,
  Context: BooleanFilterContext,
  Provider: BooleanFilterContext.Provider,
  Consumer: BooleanFilterContext.Consumer,
})
