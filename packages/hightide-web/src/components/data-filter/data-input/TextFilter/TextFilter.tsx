import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { TextFilterContext } from './TextFilterContext'
import { TextFilterStateManager } from './TextFilterStateManager'
import { TextFilterOperator } from './TextFilterOperator'
import { TextFilterParameter } from './TextFilterParameter'
import { TextFilterLayout } from './TextFilterLayout'
import type { FilterOperatorText } from '../../filter-operator'
import { useFilterState, type FilterEvent, type FilterInputValue } from '../filter-value'

export type TextFilterProps = ControllableDOMInputProps<FilterInputValue<FilterOperatorText>, FilterEvent<FilterOperatorText>> & {
  operatorOverrides?: FilterOperatorText[],
}

const TextFilterComponent = ({
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
}: TextFilterProps) => {
  const valueBinding = useFilterState<FilterOperatorText>({
    value,
    initialValue,
    onValueChange,
    defaultValue: {
      operator: 'contains',
      parameter: {},
    },
  })

  return (
    <TextFilterStateManager
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
      <TextFilterLayout>
        <TextFilterOperator />
        <TextFilterParameter />
      </TextFilterLayout>
    </TextFilterStateManager>
  )
}

export const TextFilter = Object.assign(TextFilterComponent, {
  StateManager: TextFilterStateManager,
  Layout: TextFilterLayout,
  Operator: TextFilterOperator,
  Parameter: TextFilterParameter,
  Context: TextFilterContext,
  Provider: TextFilterContext.Provider,
  Consumer: TextFilterContext.Consumer,
})
