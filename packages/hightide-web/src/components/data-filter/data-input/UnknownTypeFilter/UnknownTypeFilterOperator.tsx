import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import { useUnknownTypeFilterContext } from './UnknownTypeFilterContext'

export function UnknownTypeFilterOperator() {
  const context = useUnknownTypeFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.unknownType.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.unknownType) as FilterOperatorUnknownType[]
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
