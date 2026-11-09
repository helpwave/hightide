import { FilterOperatorSelect } from '../FilterOperatorSelect'
import { FilterOperatorUtils } from '../../filter-operator'
import type { FilterOperatorTags } from '../../filter-operator'
import { useMultiTagsFilterContext } from './MultiTagsFilterContext'

export function MultiTagsFilterOperator() {
  const context = useMultiTagsFilterContext()
  const overrides = context.config.operatorOverrides
  const operators = (overrides && overrides.length > 0
    ? FilterOperatorUtils.operatorsByCategory.multiTags.filter(op => overrides.includes(op))
    : FilterOperatorUtils.operatorsByCategory.multiTags) as FilterOperatorTags[]
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
