import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorNumber } from '../../filter-operator'
import { useNumberFilterContext } from './NumberFilterContext'

export function NumberFilterOperator() {
  const context = useNumberFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.number.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.number) as FilterOperatorNumber[]
  return (
    <FilterOperatorSelect
      value={context.state.value.operator}
      onValueChange={(operator) => context.dispatch({
        type: 'change',
        value: { ...context.state.value, operator },
      })}
      operators={operators}
      isDisabled={context.config.isDisabled}
      isReadOnly={context.config.isReadOnly}
      isInvalid={context.config.isInvalid}
      isRequired={context.config.isRequired}
    />
  )
}
