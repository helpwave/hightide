import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorDatetime } from '../../filter-operator'
import { useDateTimeFilterContext } from './DateTimeFilterContext'

export function DateTimeFilterOperator() {
  const context = useDateTimeFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.dateTime.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.dateTime) as FilterOperatorDatetime[]
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
