import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorBoolean } from '../../filter-operator'
import { useBooleanFilterContext } from './BooleanFilterContext'

export function BooleanFilterOperator() {
  const context = useBooleanFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.boolean.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.boolean) as FilterOperatorBoolean[]
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
