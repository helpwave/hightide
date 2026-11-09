import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { DateTimeFilterContext } from './DateTimeFilterContext'
import { DateTimeFilterStateManager } from './DateTimeFilterStateManager'
import { DateTimeFilterOperator } from './DateTimeFilterOperator'
import { DateTimeFilterParameter } from './DateTimeFilterParameter'
import { DateTimeFilterLayout } from './DateTimeFilterLayout'
import type { FilterOperatorDatetime } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type DateTimeFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorDatetime>, FilterEvent<FilterOperatorDatetime>> & {
  operatorOverrides?: FilterOperatorDatetime[],
}

const DateTimeFilterComponent = ({
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
}: DateTimeFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorDatetime>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'between',
      parameter: {},
    },
  })

  return (
    <DateTimeFilterStateManager
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
      <DateTimeFilterLayout>
        <DateTimeFilterOperator />
        <DateTimeFilterParameter />
      </DateTimeFilterLayout>
    </DateTimeFilterStateManager>
  )
}

export const DateTimeFilter = Object.assign(DateTimeFilterComponent, {
  StateManager: DateTimeFilterStateManager,
  Layout: DateTimeFilterLayout,
  Operator: DateTimeFilterOperator,
  Parameter: DateTimeFilterParameter,
  Context: DateTimeFilterContext,
  Provider: DateTimeFilterContext.Provider,
  Consumer: DateTimeFilterContext.Consumer,
})
