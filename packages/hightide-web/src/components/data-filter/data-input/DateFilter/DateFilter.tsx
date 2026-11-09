import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { DateFilterContext } from './DateFilterContext'
import { DateFilterStateManager } from './DateFilterStateManager'
import { DateFilterOperator } from './DateFilterOperator'
import { DateFilterParameter } from './DateFilterParameter'
import { DateFilterLayout } from './DateFilterLayout'
import type { FilterOperatorDate } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type DateFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorDate>, FilterEvent<FilterOperatorDate>> & {
  operatorOverrides?: FilterOperatorDate[],
}

const DateFilterComponent = ({
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
}: DateFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorDate>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'between',
      parameter: {},
    },
  })

  return (
    <DateFilterStateManager
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
      <DateFilterLayout>
        <DateFilterOperator />
        <DateFilterParameter />
      </DateFilterLayout>
    </DateFilterStateManager>
  )
}

export const DateFilter = Object.assign(DateFilterComponent, {
  StateManager: DateFilterStateManager,
  Layout: DateFilterLayout,
  Operator: DateFilterOperator,
  Parameter: DateFilterParameter,
  Context: DateFilterContext,
  Provider: DateFilterContext.Provider,
  Consumer: DateFilterContext.Consumer,
})
