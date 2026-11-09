import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorTagsSingle } from '../../filter-operator'
import { useSingleTagFilterContext } from './SingleTagFilterContext'

export function SingleTagFilterOperator() {
  const context = useSingleTagFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.singleTag.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.singleTag) as FilterOperatorTagsSingle[]
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
