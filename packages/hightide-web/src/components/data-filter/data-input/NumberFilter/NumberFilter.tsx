import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { NumberFilterContext } from './NumberFilterContext'
import { NumberFilterStateManager } from './NumberFilterStateManager'
import { NumberFilterOperator } from './NumberFilterOperator'
import { NumberFilterParameter } from './NumberFilterParameter'
import { NumberFilterLayout } from './NumberFilterLayout'
import type { FilterOperatorNumber } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type NumberFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorNumber>, FilterEvent<FilterOperatorNumber>> & {
  operatorOverrides?: FilterOperatorNumber[],
}

const NumberFilterComponent = ({
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
}: NumberFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorNumber>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'between',
      parameter: {},
    },
  })

  return (
    <NumberFilterStateManager
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
      <NumberFilterLayout>
        <NumberFilterOperator />
        <NumberFilterParameter />
      </NumberFilterLayout>
    </NumberFilterStateManager>
  )
}

export const NumberFilter = Object.assign(NumberFilterComponent, {
  StateManager: NumberFilterStateManager,
  Layout: NumberFilterLayout,
  Operator: NumberFilterOperator,
  Parameter: NumberFilterParameter,
  Context: NumberFilterContext,
  Provider: NumberFilterContext.Provider,
  Consumer: NumberFilterContext.Consumer,
})
